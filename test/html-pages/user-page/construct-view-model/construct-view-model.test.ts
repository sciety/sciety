import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CandidateUserHandle } from '../../../../src/types/candidate-user-handle';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { TestFramework, createTestFramework } from '../../../framework';
import * as LOID from '../../../../src/types/list-owner-id';
import { List } from '../../../../src/types/list';
import { arbitraryList } from '../../../types/list-helper';
import { arbitraryUserDetails } from '../../../types/user-details.helper';
import { constructViewModel, Ports } from '../../../../src/html-pages/user-page/construct-view-model';
import { ViewModel } from '../../../../src/html-pages/user-page/view-model';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryGroup } from '../../../types/group.helper';

describe('construct-view-model', () => {
  let framework: TestFramework;
  let adapters: Ports;
  let viewmodel: ViewModel;
  const user = arbitraryUserDetails();
  const pageParams = {
    handle: user.handle as string as CandidateUserHandle,
    user: O.none,
  };

  beforeEach(async () => {
    framework = createTestFramework();
    adapters = {
      ...framework.queries,
    };
    await framework.commandHelpers.createUserAccount(user);
  });

  describe('when the user owns two lists', () => {
    let initialUserList: List;
    const updatedList = arbitraryList(LOID.fromUserId(user.id));

    beforeEach(async () => {
      initialUserList = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(user.id))[0];
      await framework.commandHelpers.createList(updatedList);
      await framework.commandHelpers.addArticleToList(arbitraryArticleId(), updatedList.id);
    });

    describe('and the lists tab is selected', () => {
      beforeEach(async () => {
        viewmodel = await pipe(
          pageParams,
          constructViewModel('lists', adapters),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('the lists tab is the active tab', () => {
        expect(viewmodel.activeTab.selector).toBe('lists');
      });

      it('the list count is 2', async () => {
        expect(viewmodel.listCount).toBe(2);
      });

      it('two list cards are displayed', () => {
        if (viewmodel.activeTab.selector !== 'lists') {
          throw new Error('the wrong tab is selected');
        }

        expect(viewmodel.activeTab.ownedLists).toHaveLength(2);
      });

      it('the most recently updated list is shown first', async () => {
        expect(viewmodel.activeTab).toStrictEqual(expect.objectContaining({
          ownedLists: [
            expect.objectContaining({ listId: updatedList.id }),
            expect.objectContaining({ listId: initialUserList.id }),
          ],
        }));
      });
    });
  });

  describe('when the user saves an article to the default list for the first time', () => {
    beforeEach(async () => {
      const list = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(user.id))[0];
      await framework.commandHelpers.addArticleToList(arbitraryArticleId(), list.id);
    });

    it('the article count of the default list is 1', async () => {
      viewmodel = await pipe(
        pageParams,
        constructViewModel('lists', adapters),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(viewmodel.activeTab).toStrictEqual(expect.objectContaining({
        ownedLists: [expect.objectContaining({
          articleCount: 1,
        })],
      }));
    });
  });

  describe('when the user follows three groups', () => {
    const group1 = arbitraryGroup();
    const group2 = arbitraryGroup();
    const group3 = arbitraryGroup();

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(group1);
      await framework.commandHelpers.createGroup(group2);
      await framework.commandHelpers.createGroup(group3);
      await framework.commandHelpers.followGroup(user.id, group1.id);
      await framework.commandHelpers.followGroup(user.id, group2.id);
      await framework.commandHelpers.followGroup(user.id, group3.id);
    });

    describe('when the followed groups tab is selected', () => {
      beforeEach(async () => {
        viewmodel = await pipe(
          pageParams,
          constructViewModel('followed-groups', adapters),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('the followed groups tab is the active tab', () => {
        expect(viewmodel.activeTab.selector).toBe('followed-groups');
      });

      it('the following count is 3', () => {
        // eslint-disable-next-line jest/prefer-to-have-length
        expect(viewmodel.groupIds.length).toBe(3);
      });

      it('three group cards are displayed', () => {
        if (viewmodel.activeTab.selector !== 'followed-groups') {
          throw new Error('the wrong tab is selected');
        }
        if (O.isNone(viewmodel.activeTab.followedGroups)) {
          throw new Error('None received, should have been Some');
        }

        expect(viewmodel.activeTab.followedGroups.value).toHaveLength(3);
      });

      it.failing('returns them in order of most recently followed first', async () => {
        expect(viewmodel.activeTab).toStrictEqual(expect.objectContaining({
          followedGroups: O.some([
            expect.objectContaining({ id: group3.id }),
            expect.objectContaining({ id: group2.id }),
            expect.objectContaining({ id: group1.id }),
          ]),
        }));
      });
    });
  });

  describe.each([
    ['lists'],
    ['followed-groups'],
  ])('page tab: %s', (tabName: string) => {
    beforeEach(async () => {
      viewmodel = await pipe(
        pageParams,
        constructViewModel(tabName, adapters),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('exposes the user details', async () => {
      expect(viewmodel.userDetails.handle).toBe(user.handle);
      expect(viewmodel.userDetails.displayName).toBe(user.displayName);
      expect(viewmodel.userDetails.avatarUrl).toBe(user.avatarUrl);
    });
  });
});
