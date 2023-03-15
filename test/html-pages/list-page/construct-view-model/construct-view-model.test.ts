import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { UserDetails } from '../../../../src/types/user-details';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { ViewModel } from '../../../../src/html-pages/list-page/view-model';
import { constructViewModel, Ports } from '../../../../src/html-pages/list-page/construct-view-model/construct-view-model';
import { createTestFramework, TestFramework } from '../../../framework';
import { arbitraryUserDetails } from '../../../types/user-details.helper';
import { arbitraryListId } from '../../../types/list-id.helper';

describe('construct-view-model', () => {
  let framework: TestFramework;
  let adapters: Ports;
  const listId = arbitraryListId();

  beforeEach(() => {
    framework = createTestFramework();
    adapters = {
      ...framework.queries,
      ...framework.happyPathThirdParties,
      getAllEvents: framework.getAllEvents,
    };
  });

  describe('when a user saves an article that is not in any list', () => {
    let viewModel: ViewModel;
    let userDetails: UserDetails;

    beforeEach(async () => {
      userDetails = arbitraryUserDetails();
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

    it.skip('the article details are included in the page content', () => {
      const articleId = arbitraryArticleId();

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
  });
});
