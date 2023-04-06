import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { DomainEvent } from '../../../src/domain-events';
import { arbitraryUri } from '../../helpers';
import { executeCommand } from '../../../src/write-side/update-user-details/execute-command';
import { UpdateUserDetailsCommand, updateUserDetailsCommandCodec } from '../../../src/write-side/commands';
import { shouldNotBeCalled } from '../../should-not-be-called';

const constructUpdateUserDetailsCommand = (input: unknown): UpdateUserDetailsCommand => pipe(
  input,
  updateUserDetailsCommandCodec.decode,
  E.getOrElseW(shouldNotBeCalled),
);

describe('execute-command', () => {
  const originalUserDetails = arbitraryUserDetails();
  const resource = {
    avatarUrl: originalUserDetails.avatarUrl,
  };
  let events: ReadonlyArray<DomainEvent>;

  describe('when passed a new avatar url', () => {
    const newAvatarUrl = arbitraryUri();
    const command = constructUpdateUserDetailsCommand({
      userId: originalUserDetails.id,
      avatarUrl: newAvatarUrl,
    });

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
      avatarUrl: originalUserDetails.avatarUrl,
      displayName: undefined,
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
