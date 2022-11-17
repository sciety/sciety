import { pipe } from 'fp-ts/function';
import { userCreatedAccount } from '../../src/domain-events';
import { determineUsersInNeedOfLists } from '../../src/lists/backfill-lists-for-users-without-lists';
import * as LOID from '../../src/types/list-owner-id';
import { arbitraryString } from '../helpers';
import { arbitraryListId } from '../types/list-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('backfill-lists-for-users-without-lists', () => {
  describe('given a user who has a list', () => {
    it('returns no users to backfill', () => {
      const userId = arbitraryUserId();
      const adapters = {
        selectAllListsOwnedBy: () => [{
          listId: arbitraryListId(),
          ownerId: LOID.fromUserId(userId),
          articleIds: [],
        }],
      };
      const events = [
        userCreatedAccount(userId, arbitraryString(), arbitraryString(), arbitraryString()),
      ];
      const users = pipe(
        events,
        determineUsersInNeedOfLists(adapters),
      );

      expect(users).toStrictEqual([]);
    });
  });

  describe('given a user who has no lists', () => {
    it.failing('returns the user to be backfilled', () => {
      const user = {
        id: arbitraryUserId(),
        handle: arbitraryString(),
        avatarUrl: arbitraryString(),
      };
      const adapters = {
        selectAllListsOwnedBy: () => [],
      };
      const events = [
        userCreatedAccount(user.id, user.handle, user.avatarUrl, arbitraryString()),
      ];
      const users = pipe(
        events,
        determineUsersInNeedOfLists(adapters),
      );

      expect(users).toStrictEqual([user]);
    });
  });
});
