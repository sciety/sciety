import * as T from 'fp-ts/Task';
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
      it.todo('raises no events');
    });

    describe('because there are already events initiated by this user, but no UserCreatedAccount event', () => {
      it.skip('raises no events', async () => {
        const user = arbitraryUser();
        const getAllEvents = T.of([
          userFollowedEditorialCommunity(user.id, arbitraryGroupId()),
        ]);
        const commitEvents = jest.fn(() => T.of(undefined));
        await createAccountIfNecessary({ getAllEvents, commitEvents })(user)();

        expect(commitEvents).toHaveBeenCalledWith([]);
      });
    });
  });

  describe('when the user has not already created an account', () => {
    it.todo('raises a UserCreatedAccount event');
  });
});
