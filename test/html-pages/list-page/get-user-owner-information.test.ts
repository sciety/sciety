import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { getUserOwnerInformation, Ports } from '../../../src/html-pages/list-page/get-user-owner-information';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../../helpers';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('get-user-owner-information', () => {
  const userId = arbitraryUserId();

  describe('when Twitter finds the given user', () => {
    it('returns the corresponding owner info', () => {
      const userDisplayName = arbitraryString();
      const userAvatarUrl = arbitraryUri().toString();
      const userHandle = arbitraryWord();
      const ports: Ports = {
        getUser: () => O.some({
          displayName: userDisplayName,
          handle: userHandle,
          avatarUrl: userAvatarUrl,
          id: userId,
        }),
      };

      const ownerInfo = pipe(
        userId,
        getUserOwnerInformation(ports),
      );

      expect(ownerInfo).toStrictEqual(O.some({
        ownerName: userDisplayName,
        ownerAvatarPath: userAvatarUrl,
        ownerHref: `/users/${userHandle}`,
      }));
    });
  });

  describe('when Twitter does not find the given user', () => {
    it('returns a not-found error', () => {
      const ports = {
        getUser: () => O.none,
      };

      const ownerInfo = pipe(
        userId,
        getUserOwnerInformation(ports),
      );

      expect(ownerInfo).toStrictEqual(O.none);
    });
  });
});
