import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { updateUserDetailsCommandHandler } from '../../../src/write-side/update-user-details/update-user-details-command-handler';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { createTestFramework, TestFramework } from '../../framework';

describe('update user details command handler', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('given a new avatarUrl in the command', () => {
    it.todo('raises an UpdateUserDetails event');
  });

  describe('given an avatarUrl in the command that matches the current avatarUrl', () => {
    const userDetails = arbitraryUserDetails();

    beforeEach(async () => {
      await framework.commandHelpers.createUserAccount(userDetails);
      const command = {
        userId: userDetails.id,
        avatarUrl: userDetails.avatarUrl,
        displayName: undefined,
      };
      const adapters = {
        getAllEvents: framework.getAllEvents,
        commitEvents: jest.fn(),
      };
      await pipe(
        command,
        updateUserDetailsCommandHandler(adapters),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it.todo('does not raise an UpdateUserDetails event');
  });
});
