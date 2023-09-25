import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { ArticleCardWithControlsAndAnnotationViewModel, constructViewModel } from '../../../src/shared-components/article-card-with-controls-and-annotation';
import { TestFramework, createTestFramework } from '../../framework';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryCreateListCommand } from '../../write-side/commands/create-list-command.helper';
import { arbitraryHtmlFragment } from '../../helpers';

const mustBeOnTheRight = E.getOrElseW((left: unknown) => {
  throw new Error(`Must be on the right. Left was: ${JSON.stringify(left, null, 2)}`);
});

const mustBeSome = O.getOrElseW(() => {
  throw new Error('Received O.None but wanted O.Some');
});

describe('construct-view-model', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('given an article in a list', () => {
    const articleId = arbitraryArticleId();
    const createListCommand = arbitraryCreateListCommand();
    const listId = createListCommand.listId;

    beforeEach(async () => {
      await framework.commandHelpers.createList(createListCommand);
      await framework.commandHelpers.addArticleToList(articleId, listId);
    });

    describe('when the logged in user is the list owner', () => {
      describe('when it never has been annotated', () => {
        let formHref: (ArticleCardWithControlsAndAnnotationViewModel['controls'] & { _tag: 'Some' })['value']['createAnnotationFormHref'];

        beforeEach(async () => {
          formHref = await pipe(
            articleId,
            constructViewModel(framework.dependenciesForViews, true, listId),
            T.map(mustBeOnTheRight),
            T.map((viewModel) => viewModel.controls),
            T.map(mustBeSome),
            T.map((controls) => controls.createAnnotationFormHref),
          )();
        });

        it('displays a call to action to create an annotation', () => {
          expect(O.isSome(formHref)).toBe(true);
        });
      });

      describe('when it is currently annotated', () => {
        let formHref: (ArticleCardWithControlsAndAnnotationViewModel['controls'] & { _tag: 'Some' })['value']['createAnnotationFormHref'];

        beforeEach(async () => {
          await framework.commandHelpers.createAnnotation({
            content: arbitraryHtmlFragment(),
            target: { articleId, listId },
          });
          formHref = await pipe(
            articleId,
            constructViewModel(framework.dependenciesForViews, true, listId),
            T.map(mustBeOnTheRight),
            T.map((viewModel) => viewModel.controls),
            T.map(mustBeSome),
            T.map((controls) => controls.createAnnotationFormHref),
          )();
        });

        it.failing('does not display a call to action to create an annotation', () => {
          expect(O.isNone(formHref)).toBe(true);
        });
      });
    });

    describe('when the user is not logged in', () => {
      let controls: ArticleCardWithControlsAndAnnotationViewModel['controls'];

      beforeEach(async () => {
        controls = await pipe(
          articleId,
          constructViewModel(framework.dependenciesForViews, false, listId),
          T.map(mustBeOnTheRight),
          T.map((viewModel) => viewModel.controls),
        )();
      });

      it.failing('does not display a call to action to create an annotation', () => {
        expect(O.isNone(controls)).toBe(true);
      });
    });

    describe('when the logged in user is not the list owner', () => {
      let controls: ArticleCardWithControlsAndAnnotationViewModel['controls'];

      beforeEach(async () => {
        controls = await pipe(
          articleId,
          constructViewModel(framework.dependenciesForViews, false, listId),
          T.map(mustBeOnTheRight),
          T.map((viewModel) => viewModel.controls),
        )();
      });

      it.failing('does not display a call to action to create an annotation', () => {
        expect(O.isNone(controls)).toBe(true);
      });
    });
  });
});
