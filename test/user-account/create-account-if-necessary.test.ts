import * as T from 'fp-ts/Task';
import { userCreatedAccount } from '../../src/domain-events/user-created-account-event';
import { userFollowedEditorialCommunity } from '../../src/domain-events/user-followed-editorial-community-event';
import { createAccountIfNecessary } from '../../src/user-account/create-account-if-necessary';
import { arbitraryWord } from '../helpers';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

const arbitraryUser = () => ({
  id: arbitraryUserId(),
  handle: arbitraryWord(),
});

describe('create-account-if-necessary', () => {
  describe('when the user has already created an account', () => {
    describe('because there is a UserCreatedAccount event', () => {
      const user = arbitraryUser();
      const getAllEvents = T.of([
        userCreatedAccount(user.id, user.handle),
      ]);
      const commitEvents = jest.fn(() => T.of(undefined));

      beforeEach(async () => {
        await createAccountIfNecessary({ getAllEvents, commitEvents })(user)();
      });

      it.skip('raises no events', () => {
        expect(commitEvents).toHaveBeenCalledWith([]);
      });
    });

    describe('because there are already events initiated by this user, but no UserCreatedAccount event', () => {
      const user = arbitraryUser();
      const getAllEvents = T.of([
        userFollowedEditorialCommunity(user.id, arbitraryGroupId()),
      ]);
      const commitEvents = jest.fn(() => T.of(undefined));

      beforeEach(async () => {
        await createAccountIfNecessary({ getAllEvents, commitEvents })(user)();
      });

      it.skip('raises no events', async () => {
        expect(commitEvents).toHaveBeenCalledWith([]);
      });
    });
  });

  describe('when the user has not already created an account', () => {
    const user = arbitraryUser();
    const getAllEvents = T.of([]);
    const commitEvents = jest.fn(() => T.of(undefined));

    beforeEach(async () => {
      await createAccountIfNecessary({ getAllEvents, commitEvents })(user)();
    });

    it.skip('raises a UserCreatedAccount event', () => {
      expect(commitEvents).toHaveBeenCalledWith([expect.objectContaining({
        userId: user.id,
        handle: user.handle,
      })]);
    });
  });
});
