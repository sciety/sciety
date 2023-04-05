import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { userDetailsUpdated } from '../../../src/domain-events/user-details-updated-event';
import { userCreatedAccount } from '../../../src/domain-events';
import * as User from '../../../src/write-side/resources/user-resource';
import { arbitraryUserHandle } from '../../types/user-handle.helper';
import { arbitraryUserId } from '../../types/user-id.helper';
import { arbitraryString, arbitraryUri } from '../../helpers';
import { UserHandle } from '../../../src/types/user-handle';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { replayUserResource, UserResource } from '../../../src/write-side/resources/user-resource';
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
            userDetailsUpdated(userDetails.id, O.some(mostRecentlyUpdatedAvatarUrl), O.none),
          ];

          resource = pipe(
            events,
            replayUserResource(userDetails.id),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it.failing('their most recent avatar url is in the resource', () => {
          expect(resource.avatarUrl).toStrictEqual(mostRecentlyUpdatedAvatarUrl);
        });

        it.todo('their most recent display name is in the resource');
      });
    });

    describe('when the user does not exist', () => {
      it.todo('fails');
    });
  });

  describe('exists', () => {
    describe('when the user exists', () => {
      describe('with an identical handle', () => {
        it('returns true', () => {
          const handle = arbitraryUserHandle();
          const result = pipe(
            [
              userCreatedAccount(
                arbitraryUserId(),
                handle,
                arbitraryUri(),
                arbitraryString(),
              ),
            ],
            User.exists(handle),
          );

          expect(result).toBe(true);
        });
      });

      describe('with a handle matching except for case', () => {
        it('returns true', () => {
          const result = pipe(
            [
              userCreatedAccount(
                arbitraryUserId(),
                'ahandle' as UserHandle,
                arbitraryUri(),
                arbitraryString(),
              ),
            ],
            User.exists('AHandle' as UserHandle),
          );

          expect(result).toBe(true);
        });
      });
    });

    describe('when the user does not exist', () => {
      it('returns false', () => {
        const result = pipe(
          [],
          User.exists(arbitraryUserHandle()),
        );

        expect(result).toBe(false);
      });
    });
  });
});
