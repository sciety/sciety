import { constructEvent } from '../../../../src/domain-events/index.js';
import * as LOID from '../../../../src/types/list-owner-id.js';
import { setUpUserIfNecessary } from '../../../../src/write-side/resources/user/set-up-user-if-necessary.js';
import { CreateUserAccountCommand } from '../../../../src/write-side/commands/index.js';
import { arbitraryString, arbitraryUri } from '../../../helpers.js';
import { arbitraryListId } from '../../../types/list-id.helper.js';
import { arbitraryUserId } from '../../../types/user-id.helper.js';
import { arbitraryUserHandle } from '../../../types/user-handle.helper.js';

describe('set-up-user-if-necessary', () => {
  const command: CreateUserAccountCommand = {
    userId: arbitraryUserId(),
    handle: arbitraryUserHandle(),
    avatarUrl: arbitraryUri(),
    displayName: arbitraryString(),
  };

  describe('when the user already exists', () => {
    const events = [
      constructEvent('UserCreatedAccount')(command),
      constructEvent('ListCreated')({
        listId: arbitraryListId(),
        name: arbitraryString(),
        description: arbitraryString(),
        ownerId: LOID.fromUserId(command.userId),
      }),
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
