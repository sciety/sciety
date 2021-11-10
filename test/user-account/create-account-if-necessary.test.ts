import { createAccountIfNecessary } from '../../src/user-account/create-account-if-necessary';
import { arbitraryWord } from '../helpers';
import { arbitraryUserId } from '../types/user-id.helper';

const arbitraryUser = () => ({
  id: arbitraryUserId(),
  handle: arbitraryWord(),
});

describe('create-account-if-necessary', () => {
  describe('when the user has already created an account', () => {
    describe('because there is a UserCreatedAccount event', () => {
      it.todo('raises no events');
    });

    describe('because there are already events initiated by this user, but no UserCreatedAccount event', () => {
      it.skip('raises no events', () => {
        const commitEvents = jest.fn();
        const user = arbitraryUser();
        createAccountIfNecessary(commitEvents)(user);

        expect(commitEvents).toHaveBeenCalledWith([]);
      });
    });
  });

  describe('when the user has not already created an account', () => {
    it.todo('raises a UserCreatedAccount event');
  });
});
