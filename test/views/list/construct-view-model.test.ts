import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { createTestFramework, TestFramework } from '../../framework';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import * as LOID from '../../../src/types/list-owner-id';
import { constructViewModel } from '../../../src/views/list/construct-view-model';
import { ViewModel } from '../../../src/views/list/view-model';

describe('construct-view-model', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the list contains two articles', () => {
    const articleId1 = arbitraryArticleId();
    const articleId2 = arbitraryArticleId();
    let viewModel: ViewModel;
    const createList = async () => {
      const userDetails = arbitraryUserDetails();
      await framework.commandHelpers.createUserAccount(userDetails);
      const list = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(userDetails.id))[0];
      return list.id;
    };

    beforeEach(async () => {
      const listId = await createList();
      await framework.commandHelpers.addArticleToList(articleId1, listId);
      await framework.commandHelpers.addArticleToList(articleId2, listId);
      viewModel = await pipe(
        { id: listId },
        constructViewModel(framework.dependenciesForViews),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('sorts the articles in reverse order of being added to the list', () => {
      expect(viewModel.articles).toStrictEqual([
        expect.objectContaining({
          articleId: articleId2,
        }),
        expect.objectContaining({
          articleId: articleId1,
        }),
      ]);
    });
  });
});
