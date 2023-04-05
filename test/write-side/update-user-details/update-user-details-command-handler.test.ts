import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { updateUserDetailsCommandHandler } from '../../../src/write-side/update-user-details/update-user-details-command-handler';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import {
  createEventStore, EventStore,
} from '../../framework';
import { createUserAccountCommandHandler } from '../../../src/write-side/create-user-account';
import { UserDetails } from '../../../src/types/user-details';

describe('update user details command handler', () => {
  let eventStore: EventStore;
  let createUserAccount: (user: UserDetails) => Promise<unknown>;

  beforeEach(() => {
    eventStore = createEventStore(() => undefined);
    createUserAccount = async (user: UserDetails) => pipe(
      ({ ...user, userId: user.id }),
      createUserAccountCommandHandler(eventStore),
      TE.getOrElse(shouldNotBeCalled),
    )();
  });

  describe('given a new avatarUrl in the command', () => {
    it.todo('raises an UpdateUserDetails event');
  });

  describe('given an avatarUrl in the command that matches the current avatarUrl', () => {
    const userDetails = arbitraryUserDetails();

    beforeEach(async () => {
      await createUserAccount(userDetails);
    });

    it('does not raise an UpdateUserDetails event', async () => {
      const command = {
        id: userDetails.id,
        avatarUrl: O.some(userDetails.avatarUrl),
        displayName: O.none,
      };
      const commandResult = await pipe(
        command,
        updateUserDetailsCommandHandler(eventStore),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(commandResult).toBe('no-events-created');
    });
  });
});
