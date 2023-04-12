import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { userDetailsUpdated } from '../../../src/domain-events/user-details-updated-event';
import { userCreatedAccount } from '../../../src/domain-events';
import { arbitraryUri } from '../../helpers';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { replayUserResource, UserResource } from '../../../src/write-side/resources/user/replay-user-resource';
import { shouldNotBeCalled } from '../../should-not-be-called';

describe('user-resource', () => {
  describe('replay user resource', () => {
    describe('when the user exists', () => {
      const userDetails = arbitraryUserDetails();
      let resource: UserResource;

      describe('and they have not previously updated their user details', () => {
        beforeEach(() => {
          const events = [
            userCreatedAccount(userDetails.id, userDetails.handle, userDetails.avatarUrl, userDetails.displayName),
          ];

          resource = pipe(
            events,
            replayUserResource(userDetails.id),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it('their original avatar url is in the resource', () => {
          expect(resource.avatarUrl).toStrictEqual(userDetails.avatarUrl);
        });

        it.todo('their original display name is in the resource');
      });

      describe('and they have previously updated their user details', () => {
        const mostRecentlyUpdatedAvatarUrl = arbitraryUri();

        beforeEach(() => {
          const events = [
            userCreatedAccount(userDetails.id, userDetails.handle, userDetails.avatarUrl, userDetails.displayName),
            userDetailsUpdated(userDetails.id, mostRecentlyUpdatedAvatarUrl),
          ];

          resource = pipe(
            events,
            replayUserResource(userDetails.id),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it('their most recent avatar url is in the resource', () => {
          expect(resource.avatarUrl).toStrictEqual(mostRecentlyUpdatedAvatarUrl);
        });

        it.todo('their most recent display name is in the resource');
      });
    });

    describe('when the user does not exist', () => {
      it.todo('fails');
    });
  });
});
