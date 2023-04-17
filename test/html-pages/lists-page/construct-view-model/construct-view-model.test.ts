import { TestFramework, createTestFramework } from '../../../framework';
import * as LOID from '../../../../src/types/list-owner-id';
import { List } from '../../../../src/types/list';
import { arbitraryList } from '../../../types/list-helper';
import { arbitraryUserDetails } from '../../../types/user-details.helper';
import { constructViewModel } from '../../../../src/html-pages/lists-page/construct-view-model/construct-view-model';
import { ViewModel } from '../../../../src/html-pages/lists-page/view-model';
import { arbitraryArticleId } from '../../../types/article-id.helper';

describe('construct-view-model', () => {
  let framework: TestFramework;
  const user = arbitraryUserDetails();

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there are two populated user lists', () => {
    let initialUserList: List;
    const updatedList = arbitraryList(LOID.fromUserId(user.id));
    let viewmodel: ViewModel;

    beforeEach(async () => {
      await framework.commandHelpers.createUserAccount(user);
      initialUserList = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(user.id))[0];
      await framework.commandHelpers.addArticleToList(arbitraryArticleId(), initialUserList.id);
      await framework.commandHelpers.createList(updatedList);
      await framework.commandHelpers.addArticleToList(arbitraryArticleId(), updatedList.id);

      viewmodel = constructViewModel(framework.queries);
    });

    it.failing('the user avatar is included in each card', () => {
      expect(viewmodel).toStrictEqual([
        expect.objectContaining({ avatarUrl: user.avatarUrl }),
        expect.objectContaining({ avatarUrl: user.avatarUrl }),
      ]);
    });

    it.skip('the most recently updated list is shown first', async () => {
      expect(viewmodel).toStrictEqual([
        expect.objectContaining({ listId: updatedList.id }),
        expect.objectContaining({ listId: initialUserList.id }),
      ]);
    });
  });
});
