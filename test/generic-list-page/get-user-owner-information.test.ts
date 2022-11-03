import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { getUserOwnerInformation } from '../../src/generic-list-page/get-user-owner-information';
import * as DE from '../../src/types/data-error';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryUserId } from '../types/user-id.helper';

describe('get-user-owner-information', () => {
  const userId = arbitraryUserId();

  describe('when Twitter finds the given user', () => {
    it('returns the corresponding owner info', async () => {
      const userDisplayName = arbitraryString();
      const userAvatarUrl = arbitraryUri().toString();
      const userHandle = arbitraryWord();
      const ports = {
        getUserDetails: () => TE.right({
          displayName: userDisplayName,
          handle: userHandle,
          avatarUrl: userAvatarUrl,
        }),
      };

      const ownerInfo = await pipe(
        userId,
        getUserOwnerInformation(ports),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(ownerInfo).toStrictEqual({
        ownerName: userDisplayName,
        ownerAvatarPath: userAvatarUrl,
        ownerHref: `/users/${userHandle}`,
      });
    });
  });

  describe('when Twitter does not find the given user', () => {
    it('returns a not-found error', async () => {
      const ports = {
        getUserDetails: () => TE.left(DE.notFound),
      };

      const ownerInfo = await pipe(
        userId,
        getUserOwnerInformation(ports),
        TE.swap,
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(ownerInfo).toStrictEqual(DE.notFound);
    });
  });
});
