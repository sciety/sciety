import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { arbitraryUserId } from '../../types/user-id.helper';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { arbitraryString, arbitraryUri } from '../../helpers';
import { constructEvent, EventOfType } from '../../../src/domain-events';
import { handleEvent, initialState } from '../../../src/read-models/users/handle-event';
import { lookupUser } from '../../../src/read-models/users/lookup-user';
import { arbitraryUserHandle } from '../../types/user-handle.helper';

const arbitraryUserCreatedAccountEvent = (): EventOfType<'UserCreatedAccount'> => constructEvent('UserCreatedAccount')(
  {
    userId: arbitraryUserId(),
    avatarUrl: arbitraryUri(),
    displayName: arbitraryString(),
    handle: arbitraryUserHandle(),
  },
);

describe('lookup-user', () => {
  describe('when user exists', () => {
    const foo = arbitraryUserCreatedAccountEvent();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const readModel = pipe(
      [
        foo,
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it.todo('returns the correct user details');
  });

  describe('when avatarUrl has been updated', () => {
    const user = arbitraryUserDetails();
    const newAvatarUrl = arbitraryUri();
    const readModel = pipe(
      [
        constructEvent('UserCreatedAccount')({
          userId: user.id,
          handle: user.handle,
          avatarUrl: user.avatarUrl,
          displayName: user.displayName,
        }),
        constructEvent('UserDetailsUpdated')({
          userId: user.id,
          avatarUrl: newAvatarUrl,
          displayName: undefined,
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns the updated avatarUrl', () => {
      expect(lookupUser(readModel)(user.id)).toStrictEqual(O.some({
        ...user,
        avatarUrl: newAvatarUrl,
      }));
    });
  });

  describe('when displayName has been updated', () => {
    const user = arbitraryUserDetails();
    const newDisplayName = arbitraryString();
    const readModel = pipe(
      [
        constructEvent('UserCreatedAccount')({
          userId: user.id,
          handle: user.handle,
          avatarUrl: user.avatarUrl,
          displayName: user.displayName,
        }),
        constructEvent('UserDetailsUpdated')({
          userId: user.id,
          avatarUrl: undefined,
          displayName: newDisplayName,
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns the updated displayName', () => {
      expect(lookupUser(readModel)(user.id)).toStrictEqual(O.some({
        ...user,
        displayName: newDisplayName,
      }));
    });
  });

  describe('when displayName and avatarUrl have been updated simultaneously', () => {
    const user = arbitraryUserDetails();
    const newDisplayName = arbitraryString();
    const newAvatarUrl = arbitraryUri();
    const readModel = pipe(
      [
        constructEvent('UserCreatedAccount')({
          userId: user.id,
          handle: user.handle,
          avatarUrl: user.avatarUrl,
          displayName: user.displayName,
        }),
        constructEvent('UserDetailsUpdated')({
          userId: user.id,
          avatarUrl: newAvatarUrl,
          displayName: newDisplayName,
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns the updated displayName and avatarUrl', () => {
      expect(lookupUser(readModel)(user.id)).toStrictEqual(O.some({
        ...user,
        displayName: newDisplayName,
        avatarUrl: newAvatarUrl,
      }));
    });
  });

  describe('when user does not exist', () => {
    const readModel = initialState();

    it('returns None', () => {
      expect(lookupUser(readModel)(arbitraryUserId())).toStrictEqual(O.none);
    });
  });
});
