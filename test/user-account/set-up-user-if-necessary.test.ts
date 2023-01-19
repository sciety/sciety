import {
  userCreatedAccount,
} from '../../src/domain-events';
import { listCreated } from '../../src/domain-events/list-created-event';
import * as LOID from '../../src/types/list-owner-id';
import { UserHandle } from '../../src/types/user-handle';
import { setUpUserIfNecessary } from '../../src/user-account/set-up-user-if-necessary';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../helpers';
import { arbitraryListId } from '../types/list-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

const arbitraryUserAccount = () => ({
  id: arbitraryUserId(),
  handle: arbitraryWord() as UserHandle,
  avatarUrl: arbitraryUri(),
  displayName: arbitraryString(),
});

describe('set-up-user-if-necessary', () => {
  const userAccount = arbitraryUserAccount();

  describe('when the user already exists', () => {
    const events = [
      userCreatedAccount(
        userAccount.id,
        userAccount.handle,
        userAccount.avatarUrl,
        userAccount.displayName,
      ),
      listCreated(arbitraryListId(), arbitraryString(), arbitraryString(), LOID.fromUserId(userAccount.id)),
    ];

    const eventsToCommit = setUpUserIfNecessary(userAccount)(events);

    it('raises no events', () => {
      expect(eventsToCommit).toStrictEqual([]);
    });
  });

  describe('when the user does not already exist', () => {
    const eventsToCommit = setUpUserIfNecessary(userAccount)([]);

    it('raises a UserCreatedAccount event and a ListCreated event', () => {
      expect(eventsToCommit).toStrictEqual([
        expect.objectContaining({
          userId: userAccount.id,
          handle: userAccount.handle,
          avatarUrl: userAccount.avatarUrl,
          displayName: userAccount.displayName,
        }),
        expect.objectContaining({
          type: 'ListCreated',
          ownerId: LOID.fromUserId(userAccount.id),
        }),
      ]);
    });
  });
});
