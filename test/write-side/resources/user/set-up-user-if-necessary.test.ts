import { constructEvent } from '../../../../src/domain-events';
import * as LOID from '../../../../src/types/list-owner-id';
import { CreateUserAccountCommand } from '../../../../src/write-side/commands';
import { setUpUserIfNecessary } from '../../../../src/write-side/resources/user/set-up-user-if-necessary';
import { arbitraryListCreatedEvent } from '../../../domain-events/list-resource-events.helper';
import { arbitraryString, arbitraryUri } from '../../../helpers';
import { arbitraryUserHandle } from '../../../types/user-handle.helper';
import { arbitraryUserId } from '../../../types/user-id.helper';

describe('set-up-user-if-necessary', () => {
  const command: CreateUserAccountCommand = {
    userId: arbitraryUserId(),
    handle: arbitraryUserHandle(),
    displayName: arbitraryString(),
  };

  describe('when the user already exists', () => {
    const events = [
      constructEvent('UserCreatedAccount')({
        ...command,
        avatarUrl: arbitraryUri(),
      }),
      {
        ...arbitraryListCreatedEvent(),
        ownerId: LOID.fromUserId(command.userId),
      },
    ];

    const eventsToCommit = setUpUserIfNecessary(command)(events);

    it('raises no events', () => {
      expect(eventsToCommit).toStrictEqual([]);
    });
  });

  describe('when the user does not already exist', () => {
    const eventsToCommit = setUpUserIfNecessary(command)([]);

    it('raises a UserCreatedAccount event and a ListCreated event', () => {
      expect(eventsToCommit[0]).toBeDomainEvent('UserCreatedAccount', {
        userId: command.userId,
        handle: command.handle,
        displayName: command.displayName,
      });
      expect(eventsToCommit[1]).toBeDomainEvent('ListCreated', {
        ownerId: LOID.fromUserId(command.userId),
      });
    });
  });
});
