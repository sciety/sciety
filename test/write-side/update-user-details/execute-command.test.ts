import * as O from 'fp-ts/Option';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { DomainEvent } from '../../../src/domain-events';
import { arbitraryUserId } from '../../types/user-id.helper';
import { arbitraryUri } from '../../helpers';
import { executeCommand } from '../../../src/write-side/update-user-details/execute-command';

describe('execute-command', () => {
  describe('when passed a new avatar url', () => {
    const userId = arbitraryUserId();
    const newAvatarUrl = arbitraryUri();
    const command = { id: userId, avatarUrl: O.some(newAvatarUrl), displayName: O.none };
    const resource = {
      avatarUrl: arbitraryUri(),
    };
    let events: ReadonlyArray<DomainEvent>;

    beforeEach(() => {
      events = executeCommand(command)(resource);
    });

    it('raises an event to update avatar url', () => {
      expect(events).toStrictEqual([
        expect.objectContaining({ userId, avatarUrl: O.some(newAvatarUrl), displayName: O.none }),
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
    const userDetails = arbitraryUserDetails();
    const command = { id: userDetails.id, avatarUrl: O.some(userDetails.avatarUrl), displayName: O.none };
    const resource = {
      avatarUrl: userDetails.avatarUrl,
    };
    let events: ReadonlyArray<DomainEvent>;

    beforeEach(() => {
      events = executeCommand(command)(resource);
    });

    it.failing('raises no events', () => {
      expect(events).toStrictEqual([]);
    });
  });

  describe('when passed the existing display name', () => {
    it.todo('raises no events');
  });
});
