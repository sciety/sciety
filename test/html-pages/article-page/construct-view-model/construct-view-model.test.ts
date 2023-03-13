import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { arbitraryListId } from '../../../types/list-id.helper';
import { arbitraryUserId } from '../../../types/user-id.helper';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { constructViewModel, Ports } from '../../../../src/html-pages/article-page/construct-view-model';

describe('construct-view-model', () => {
  describe('when the article is saved to a list', () => {
    it.failing('list management has access to list id', async () => {
      const adapters = {} as Ports;
      const listId = arbitraryListId();
      const viewModel = await pipe(
        {
          doi: arbitraryArticleId(),
          user: O.some({ id: arbitraryUserId() }),
        },
        constructViewModel(adapters),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(viewModel.userListManagement).toStrictEqual(O.some(expect.objectContaining({ listId })));
    });

    it.todo('list management has access to list name');

    it.todo('list management marks the article as being saved in the list');
  });
});
