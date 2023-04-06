import * as O from 'fp-ts/Option';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { DomainEvent } from '../../../src/domain-events';
import { arbitraryUri } from '../../helpers';
import { executeCommand } from '../../../src/write-side/update-user-details/execute-command';

describe('execute-command', () => {
  const originalUserDetails = arbitraryUserDetails();
  const resource = {
    avatarUrl: originalUserDetails.avatarUrl,
  };
  let events: ReadonlyArray<DomainEvent>;

  describe('when passed a new avatar url', () => {
    const newAvatarUrl = arbitraryUri();
    const command = { userId: originalUserDetails.id, avatarUrl: O.some(newAvatarUrl), displayName: O.none };

    beforeEach(() => {
      events = executeCommand(command)(resource);
    });

    it('raises an event to update avatar url', () => {
      expect(events).toStrictEqual([
        expect.objectContaining({
          userId: originalUserDetails.id,
          avatarUrl: O.some(newAvatarUrl),
          displayName: O.none,
        }),
      ]);
    });
  });

  describe('when passed a new display name', () => {
    it.todo('raises an event to update display name');
  });

  describe('when passed a new display name and a new avatar url', () => {
    it.todo('raises an event to update display name and avatar url');
  });

  describe('when passed the existing avatar url', () => {
    const command = {
      userId: originalUserDetails.id,
      avatarUrl: O.some(originalUserDetails.avatarUrl),
      displayName: O.none,
    };

    beforeEach(() => {
      events = executeCommand(command)(resource);
    });

    it('raises no events', () => {
      expect(events).toStrictEqual([]);
    });
  });

  describe('when passed the existing display name', () => {
    it.todo('raises no events');
  });
});
