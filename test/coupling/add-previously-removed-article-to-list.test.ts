import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { constructViewModel as constructArticlePage, Ports } from '../../src/html-pages/article-page/construct-view-model';
import { createReadAndWriteSides, ReadAndWriteSides } from '../create-read-and-write-sides';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('add previously removed article to list', () => {
  let getAllEvents: ReadAndWriteSides['getAllEvents'];
  let queries: ReadAndWriteSides['queries'];

  beforeEach(() => {
    ({ queries, getAllEvents } = createReadAndWriteSides());
  });

  describe('given an article that has been removed from a list', () => {
    // command: create user account
    // command: create list
    // command: add article to list
    // command: remove article from list

    describe('when that article is added to the list again', () => {
      // command: add article to list

      it.failing('is marked as saved on the article page as seen by the list owner', async () => {
        const adapters: Ports = {
          ...queries,
          getAllEvents,
          fetchReview: () => TE.left('not-found'),
          findVersionsForArticleDoi: () => TO.none,
          fetchArticle: () => TE.left('not-found'),
        };
        const articlePage = await pipe(
          {
            doi: arbitraryArticleId(),
            user: O.some({ id: arbitraryUserId() }),
          },
          constructArticlePage(adapters),
          TE.getOrElse(shouldNotBeCalled),
        )();

        expect(articlePage.userListManagement).toStrictEqual(O.some(expect.objectContaining({
          isArticleInList: true,
        })));
      });

      it.todo('appears on the list page');

      it.todo('sciety feed shows the article being added to the list');
    });
  });
});
