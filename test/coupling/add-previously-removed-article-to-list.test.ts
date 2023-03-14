import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { List } from '../../src/types/list';
import { arbitraryUserDetails } from '../types/user-details.helper';
import { constructViewModel as constructArticlePage, Ports } from '../../src/html-pages/article-page/construct-view-model';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryArticleId } from '../types/article-id.helper';
import * as LOID from '../../src/types/list-owner-id';
import { createTestFramework, TestFramework } from '../framework';

describe('add previously removed article to list', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('given an article that has been removed from a list', () => {
    const userDetails = arbitraryUserDetails();
    let list: List;
    const articleId = arbitraryArticleId();

    beforeEach(async () => {
      await framework.commandHelpers.createUserAccount(userDetails);
      // eslint-disable-next-line prefer-destructuring
      list = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(userDetails.id))[0];
      await framework.commandHelpers.addArticleToList(articleId, list.id);
      await framework.commandHelpers.removeArticleFromList(articleId, list.id);
    });

    describe('when that article is added to the list again', () => {
      beforeEach(async () => {
        await framework.commandHelpers.addArticleToList(articleId, list.id);
      });

      it('is marked as saved on the article page as seen by the list owner', async () => {
        const adapters: Ports = {
          ...framework.queries,
          ...framework.happyPathThirdParties,
          getAllEvents: framework.getAllEvents,
          findVersionsForArticleDoi: () => TO.none,
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
