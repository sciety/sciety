import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { dummyLogger } from '../../../dummy-logger';
import { UserDetails } from '../../../../src/types/user-details';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { ViewModel } from '../../../../src/html-pages/list-page/view-model';
import { constructViewModel, Ports } from '../../../../src/html-pages/list-page/construct-view-model/construct-view-model';
import { createTestFramework, TestFramework } from '../../../framework';
import { arbitraryUserDetails } from '../../../types/user-details.helper';
import * as LOID from '../../../../src/types/list-owner-id';

describe('construct-view-model', () => {
  let framework: TestFramework;
  let adapters: Ports;

  beforeEach(() => {
    framework = createTestFramework();
    adapters = {
      ...framework.queries,
      ...framework.happyPathThirdParties,
      logger: dummyLogger,
    };
  });

  describe('when a user saves an article that is not in any list', () => {
    let viewModel: ViewModel;
    let userDetails: UserDetails;
    const articleId = arbitraryArticleId();

    beforeEach(async () => {
      userDetails = arbitraryUserDetails();
      await framework.commandHelpers.createUserAccount(userDetails);
      const list = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(userDetails.id))[0];
      const listId = list.id;
      await framework.commandHelpers.addArticleToList(articleId, listId);
      viewModel = await pipe(
        {
          page: 1,
          id: listId,
          user: O.some({ id: userDetails.id }),
        },
        constructViewModel(adapters),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('the article details are included in the page content', () => {
      expect(viewModel.contentViewModel).toStrictEqual(expect.objectContaining({
        articles: [
          E.right(expect.objectContaining({
            articleViewModel: expect.objectContaining({
              articleId,
            }),
          })),
        ],
      }));
    });

    it('the list count is included in the article content', () => {
      expect(viewModel.contentViewModel).toStrictEqual(expect.objectContaining({
        articles: [
          E.right(expect.objectContaining({
            articleViewModel: expect.objectContaining({
              listMembershipCount: 1,
            }),
          })),
        ],
      }));
    });
  });
});
