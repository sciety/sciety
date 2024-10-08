import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { ArticleCardWithControlsAndAnnotationViewModel, constructArticleCardWithControlsAndAnnotation } from '../../../../../src/read-side/html-pages/shared-components/article-card-with-controls-and-annotation';
import { TestFramework, createTestFramework } from '../../../../framework';
import { arbitraryExpressionDoi } from '../../../../types/expression-doi.helper';
import { arbitraryUnsafeUserInput } from '../../../../types/unsafe-user-input.helper';
import { arbitraryCreateListCommand } from '../../../../write-side/commands/create-list-command.helper';

const mustBeOnTheRight = E.getOrElseW((left: unknown) => {
  throw new Error(`Must be on the right. Left was: ${JSON.stringify(left, null, 2)}`);
});

const mustBeSome = O.getOrElseW(() => {
  throw new Error('Received O.None but wanted O.Some');
});

describe('construct-article-card-with-controls-and-annotation', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('given an article in a list', () => {
    const expressionDoi = arbitraryExpressionDoi();
    const createListCommand = arbitraryCreateListCommand();
    const listId = createListCommand.listId;

    beforeEach(async () => {
      await framework.commandHelpers.createList(createListCommand);
      await framework.commandHelpers.addArticleToList({ expressionDoi, listId });
    });

    describe('when the user is allowed to edit the list', () => {
      describe('when it never has been annotated', () => {
        let formHref: (ArticleCardWithControlsAndAnnotationViewModel['controls'] & { _tag: 'Some' })['value']['createAnnotationFormHref'];

        beforeEach(async () => {
          formHref = await pipe(
            expressionDoi,
            constructArticleCardWithControlsAndAnnotation(framework.dependenciesForViews, true, listId),
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
            annotationContent: arbitraryUnsafeUserInput(),
            expressionDoi,
            listId,
          });
          formHref = await pipe(
            expressionDoi,
            constructArticleCardWithControlsAndAnnotation(framework.dependenciesForViews, true, listId),
            T.map(mustBeOnTheRight),
            T.map((viewModel) => viewModel.controls),
            T.map(mustBeSome),
            T.map((controls) => controls.createAnnotationFormHref),
          )();
        });

        it('does not display a call to action to create an annotation', () => {
          expect(O.isNone(formHref)).toBe(true);
        });
      });
    });

    describe('when the user is not allowed to edit the list', () => {
      let controls: ArticleCardWithControlsAndAnnotationViewModel['controls'];

      beforeEach(async () => {
        controls = await pipe(
          expressionDoi,
          constructArticleCardWithControlsAndAnnotation(framework.dependenciesForViews, false, listId),
          T.map(mustBeOnTheRight),
          T.map((viewModel) => viewModel.controls),
        )();
      });

      it('does not display a call to action to create an annotation', () => {
        expect(O.isNone(controls)).toBe(true);
      });
    });
  });
});
