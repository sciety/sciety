import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { arbitraryUserDetails } from '../types/user-details.helper';
import { constructViewModel as constructArticlePage, Ports } from '../../src/html-pages/article-page/construct-view-model';
import { createReadAndWriteSides, ReadAndWriteSides } from '../create-read-and-write-sides';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryArticleId } from '../types/article-id.helper';
import * as LOID from '../../src/types/list-owner-id';
import { arbitraryList } from '../types/list-helper';
import { CommandHelpers, createCommandHelpers } from '../create-command-helpers';

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
    const list = {
      ...arbitraryList(),
      ownerId: LOID.fromUserId(userDetails.id),
    };
    const articleId = arbitraryArticleId();

    beforeEach(async () => {
      await commandHelpers.createUserAccount(userDetails);
      await commandHelpers.createList(list);
      await commandHelpers.addArticleToList(articleId, list.id);
      await commandHelpers.removeArticleFromList(articleId, list.id);
    });

    describe('when that article is added to the list again', () => {
      beforeEach(async () => {
        await commandHelpers.addArticleToList(articleId, list.id);
      });

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
