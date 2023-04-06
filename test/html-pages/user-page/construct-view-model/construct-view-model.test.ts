import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { TestFramework, createTestFramework } from '../../../framework';
import * as LOID from '../../../../src/types/list-owner-id';
import { List } from '../../../../src/types/list';
import { arbitraryList } from '../../../types/list-helper';
import { arbitraryUserDetails } from '../../../types/user-details.helper';
import { constructViewModel, Ports } from '../../../../src/html-pages/user-page/construct-view-model';
import { ViewModel } from '../../../../src/html-pages/user-page/view-model';
import { CandidateUserHandle } from '../../../../src/types/candidate-user-handle';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryGroup } from '../../../types/group.helper';

describe('construct-view-model', () => {
  let framework: TestFramework;
  const user = arbitraryUserDetails();

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the user owns two lists', () => {
    let initialUserList: List;
    const updatedList = arbitraryList(LOID.fromUserId(user.id));
    let viewmodel: ViewModel;

    beforeEach(async () => {
      await framework.commandHelpers.createUserAccount(user);
      initialUserList = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(user.id))[0];
      await framework.commandHelpers.createList(updatedList);
      await framework.commandHelpers.addArticleToList(arbitraryArticleId(), updatedList.id);

      const adapters: Ports = {
        ...framework.queries,
        getAllEvents: framework.getAllEvents,
      };
      viewmodel = await pipe(
        {
          handle: user.handle as string as CandidateUserHandle,
          user: O.some(user),
        },
        constructViewModel('lists', adapters),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('the list count is 2', async () => {
      expect(viewmodel.listCount).toBe(2);
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

  describe('when the user saves an article to the default list for the first time', () => {
    beforeEach(async () => {
      await framework.commandHelpers.createUserAccount(user);
      const list = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(user.id))[0];
      await framework.commandHelpers.addArticleToList(arbitraryArticleId(), list.id);
    });

    it('the article count of the default list is 1', async () => {
      const adapters: Ports = {
        ...framework.queries,
        getAllEvents: framework.getAllEvents,
      };
      const viewmodel = await pipe(
        {
          handle: user.handle as string as CandidateUserHandle,
          user: O.some(user),
        },
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
      await framework.commandHelpers.createUserAccount(user);
      await framework.commandHelpers.followGroup(user.id, group1.id);
      await framework.commandHelpers.followGroup(user.id, group2.id);
      await framework.commandHelpers.followGroup(user.id, group3.id);
    });

    it.failing('returns them in order of most recently followed first', async () => {
      const ports = {
        ...framework.queries,
        getAllEvents: framework.getAllEvents,
      };
      const viewmodel = await pipe(
        {
          handle: user.handle as string as CandidateUserHandle,
          user: O.some(user),
        },
        constructViewModel('followers', ports),
        TE.getOrElse(shouldNotBeCalled),
      )();

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
