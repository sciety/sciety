import { userCreatedAccount, listCreated } from '../../../src/domain-events';
import * as LOID from '../../../src/types/list-owner-id';
import { setUpUserIfNecessary } from '../../../src/write-side/create-user-account/set-up-user-if-necessary';
import { CreateUserAccountCommand } from '../../../src/write-side/commands';
import { arbitraryString, arbitraryUri } from '../../helpers';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';
import { arbitraryUserHandle } from '../../types/user-handle.helper';

describe('set-up-user-if-necessary', () => {
  const command: CreateUserAccountCommand = {
    userId: arbitraryUserId(),
    handle: arbitraryUserHandle(),
    avatarUrl: arbitraryUri(),
    displayName: arbitraryString(),
  };

  describe('when the user already exists', () => {
    const events = [
      userCreatedAccount(
        command.userId,
        command.handle,
        command.avatarUrl,
        command.displayName,
      ),
      listCreated(arbitraryListId(), arbitraryString(), arbitraryString(), LOID.fromUserId(command.userId)),
    ];

    const eventsToCommit = setUpUserIfNecessary(command)(events);

    it('raises no events', () => {
      expect(eventsToCommit).toStrictEqual([]);
    });
  });

  describe('when the user does not already exist', () => {
    const eventsToCommit = setUpUserIfNecessary(command)([]);

    it('raises a UserCreatedAccount event and a ListCreated event', () => {
      expect(eventsToCommit).toStrictEqual([
        expect.objectContaining({
          userId: command.userId,
          handle: command.handle,
          avatarUrl: command.avatarUrl,
          displayName: command.displayName,
        }),
        expect.objectContaining({
          type: 'ListCreated',
          ownerId: LOID.fromUserId(command.userId),
        }),
      ]);
    });
  });
});
