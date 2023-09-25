import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { ArticleCardWithControlsAndAnnotationViewModel, constructViewModel } from '../../../src/shared-components/article-card-with-controls-and-annotation';
import { TestFramework, createTestFramework } from '../../framework';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { shouldNotBeCalled } from '../../should-not-be-called';

describe('construct-view-model', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('given an article in a list', () => {
    describe('when the logged in user is the list owner', () => {
      describe.skip('when it never has been annotated', () => {
        const articleId = arbitraryArticleId();
        const listId = arbitraryListId();
        let formHref: (ArticleCardWithControlsAndAnnotationViewModel['controls'] & { _tag: 'Some' })['value']['createAnnotationFormHref'];

        beforeEach(async () => {
          formHref = await pipe(
            articleId,
            constructViewModel(framework.dependenciesForViews, true, listId),
            TE.getOrElse(shouldNotBeCalled),
            T.map((viewModel) => viewModel.controls),
            TO.getOrElse(shouldNotBeCalled),
            T.map((controls) => controls.createAnnotationFormHref),
          )();
        });

        it('displays a call to action to create an annotation', () => {
          expect(O.isSome(formHref)).toBe(true);
        });
      });

      describe('when it is currently annotated', () => {
        it.todo('does not display a call to action to create an annotation');
      });
    });

    describe('when the user is not logged in', () => {
      it.todo('does not display a call to action to create an annotation');
    });

    describe('when the logged in user is not the list owner', () => {
      it.todo('does not display a call to action to create an annotation');
    });
  });
});
