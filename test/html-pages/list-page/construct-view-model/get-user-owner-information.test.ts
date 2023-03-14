import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { getUserOwnerInformation, Ports } from '../../../../src/html-pages/list-page/construct-view-model/get-user-owner-information';
import { arbitraryString, arbitraryUri } from '../../../helpers';
import { arbitraryUserId } from '../../../types/user-id.helper';
import { arbitraryUserHandle } from '../../../types/user-handle.helper';

describe('get-user-owner-information', () => {
  const userId = arbitraryUserId();

  describe('when given user exists', () => {
    it('returns the corresponding owner info', () => {
      const userDisplayName = arbitraryString();
      const userAvatarUrl = arbitraryUri().toString();
      const userHandle = arbitraryUserHandle();
      const ports: Ports = {
        lookupUser: () => O.some({
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

  describe('when the given user does not exist', () => {
    it('returns a not-found error', () => {
      const ports = {
        lookupUser: () => O.none,
      };

      const ownerInfo = pipe(
        userId,
        getUserOwnerInformation(ports),
      );

      expect(ownerInfo).toStrictEqual(O.none);
    });
  });
});
