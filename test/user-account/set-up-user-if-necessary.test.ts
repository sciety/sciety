import {
  userCreatedAccount,
} from '../../src/domain-events';
import { listCreated } from '../../src/domain-events/list-created-event';
import * as LOID from '../../src/types/list-owner-id';
import { setUpUserIfNecessary } from '../../src/user-account/set-up-user-if-necessary';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../helpers';
import { arbitraryListId } from '../types/list-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

const arbitraryUserAccount = () => ({
  id: arbitraryUserId(),
  handle: arbitraryWord(),
  avatarUrl: arbitraryUri(),
  displayName: arbitraryString(),
});

describe('set-up-user-if-necessary', () => {
  const userAccount = arbitraryUserAccount();

  describe('when the user has been fully set up', () => {
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

  describe('when the user has only created an account but has no list', () => {
    const events = [
      userCreatedAccount(
        userAccount.id,
        userAccount.handle,
        userAccount.avatarUrl,
        userAccount.displayName,
      ),
    ];

    const eventsToCommit = setUpUserIfNecessary(userAccount)(events);

    it('raises a ListCreated event', () => {
      expect(eventsToCommit).toStrictEqual([expect.objectContaining({
        type: 'ListCreated',
        ownerId: LOID.fromUserId(userAccount.id),
      })]);
    });
  });

  describe('when the user owns a list, but no account was created', () => {
    const events = [
      listCreated(arbitraryListId(), arbitraryString(), arbitraryString(), LOID.fromUserId(userAccount.id)),
    ];

    const eventsToCommit = setUpUserIfNecessary(userAccount)(events);

    it('raises UserAccountCreated event', () => {
      expect(eventsToCommit).toStrictEqual([
        expect.objectContaining({
          userId: userAccount.id,
          handle: userAccount.handle,
          avatarUrl: userAccount.avatarUrl,
          displayName: userAccount.displayName,
        }),
      ]);
    });
  });

  describe('sciety has no events related to this user', () => {
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

  describe('when another user has already created an account but this user has not', () => {
    const anotherUserAccount = arbitraryUserAccount();

    const events = [
      userCreatedAccount(
        anotherUserAccount.id,
        anotherUserAccount.handle,
        anotherUserAccount.avatarUrl,
        anotherUserAccount.displayName,
      ),
    ];

    const eventsToCommit = setUpUserIfNecessary(userAccount)(events);

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
