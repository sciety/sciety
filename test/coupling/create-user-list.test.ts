import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel as constructGroupFollowersPage } from '../../src/html-pages/group-page/group-followers-page/construct-view-model';
import { ViewModel as GroupFollowersPage } from '../../src/html-pages/group-page/group-followers-page/view-model';
import { constructViewModel as constructUserListsPage } from '../../src/html-pages/user-page/user-lists-page/construct-view-model';
import { ViewModel as UserListsPage } from '../../src/html-pages/user-page/user-lists-page/view-model';
import { CandidateUserHandle } from '../../src/types/candidate-user-handle';
import * as LOID from '../../src/types/list-owner-id';
import { createTestFramework, TestFramework } from '../framework';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryAddGroupCommand } from '../write-side/commands/add-group-command.helper';
import { arbitraryCreateListCommand } from '../write-side/commands/create-list-command.helper';
import { arbitraryCreateUserAccountCommand } from '../write-side/commands/create-user-account-command.helper';

describe('create user list', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('given a user who is following a group', () => {
    const createUserAccountCommand = arbitraryCreateUserAccountCommand();
    const addGroupCommand = arbitraryAddGroupCommand();

    beforeEach(async () => {
      await framework.commandHelpers.createUserAccount(createUserAccountCommand);
      await framework.commandHelpers.addGroup(addGroupCommand);
      await framework.commandHelpers.followGroup(createUserAccountCommand.userId, addGroupCommand.groupId);
    });

    describe('when the user creates a new list', () => {
      const command = {
        ...arbitraryCreateListCommand(),
        ownerId: LOID.fromUserId(createUserAccountCommand.userId),
      };

      beforeEach(async () => {
        await framework.commandHelpers.createList(command);
      });

      describe('on the user-lists page', () => {
        let userListsPage: UserListsPage;

        beforeEach(async () => {
          userListsPage = await pipe(
            {
              handle: createUserAccountCommand.handle as string as CandidateUserHandle,
              user: O.none,
            },
            constructUserListsPage({ ...framework.queries }),
            TE.getOrElse(shouldNotBeCalled),
          )();
        });

        it('the tabs count the list', () => {
          expect(userListsPage.listCount).toBe(2);
        });

        it('there is a card for the list', () => {
          const listIds = pipe(
            userListsPage.ownedLists,
            RA.map((l) => l.listId),
          );

          expect(listIds).toContain(command.listId);
        });
      });

      describe('on the group-followers page', () => {
        let groupFollowersPage: GroupFollowersPage;

        beforeEach(async () => {
          groupFollowersPage = await pipe(
            {
              slug: addGroupCommand.slug,
              user: O.none,
              page: 1,
            },
            constructGroupFollowersPage(framework.queries),
            TE.getOrElse(shouldNotBeCalled),
          )();
        });

        it('the user card counts the extra list', () => {
          expect(groupFollowersPage.followers[0].listCount).toBe(2);
        });
      });
    });
  });
});
