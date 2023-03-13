import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { List } from '../../src/types/list';
import { arbitraryUserDetails } from '../types/user-details.helper';
import { constructViewModel as constructArticlePage, Ports } from '../../src/html-pages/article-page/construct-view-model';
import { createReadAndWriteSides, ReadAndWriteSides } from '../create-read-and-write-sides';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryArticleId } from '../types/article-id.helper';
import * as LOID from '../../src/types/list-owner-id';
import { CommandHelpers, createCommandHelpers } from '../create-command-helpers';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';
import { arbitraryString } from '../helpers';
import { ArticleServer } from '../../src/types/article-server';

describe('add previously removed article to list', () => {
  let commandHandlers: ReadAndWriteSides['commandHandlers'];
  let getAllEvents: ReadAndWriteSides['getAllEvents'];
  let queries: ReadAndWriteSides['queries'];
  let commandHelpers: CommandHelpers;

  beforeEach(() => {
    ({ queries, getAllEvents, commandHandlers } = createReadAndWriteSides());
    commandHelpers = createCommandHelpers(commandHandlers);
  });

  describe('given an article that has been removed from a list', () => {
    const userDetails = arbitraryUserDetails();
    let list: List;
    const articleId = arbitraryArticleId();

    beforeEach(async () => {
      await commandHelpers.createUserAccount(userDetails);
      // eslint-disable-next-line prefer-destructuring
      list = queries.selectAllListsOwnedBy(LOID.fromUserId(userDetails.id))[0];
      await commandHelpers.addArticleToList(articleId, list.id);
      await commandHelpers.removeArticleFromList(articleId, list.id);
    });

    describe('when that article is added to the list again', () => {
      beforeEach(async () => {
        await commandHelpers.addArticleToList(articleId, list.id);
      });

      it('is marked as saved on the article page as seen by the list owner', async () => {
        const adapters: Ports = {
          ...queries,
          getAllEvents,
          fetchReview: () => TE.left('not-found'),
          findVersionsForArticleDoi: () => TO.none,
          fetchArticle: () => TE.right({
            doi: articleId,
            authors: O.none,
            title: sanitise(toHtmlFragment(arbitraryString())),
            abstract: sanitise(toHtmlFragment(arbitraryString())),
            server: 'biorxiv' as ArticleServer,
          }),
        };
        const articlePage = await pipe(
          {
            doi: articleId,
            user: O.some({ id: userDetails.id }),
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
