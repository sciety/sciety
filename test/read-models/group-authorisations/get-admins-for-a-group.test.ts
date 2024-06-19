/* eslint-disable @typescript-eslint/no-unused-vars */
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events';
import { handleEvent, initialState } from '../../../src/read-models/group-authorisations/handle-event';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('get-admins-for-a-group', () => {
  describe('when no user has been assigned as an admin of the group', () => {
    const userId = arbitraryUserId();
    const groupId = arbitraryGroupId();
    const readModel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );

    it.todo('returns no admins');
  });

  describe('when a user has been assigned as an admin of the group', () => {
    const userId = arbitraryUserId();
    const groupId = arbitraryGroupId();
    const readModel = pipe(
      [
        constructEvent('UserAssignedAsAdminOfGroup')({
          userId,
          groupId,
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it.todo('returns that user as an admin');
  });

  describe('when a user has been assigned as an admin of another group', () => {
    it.todo('returns no admins');
  });

  describe('when multiple users have been assigned as admins of the group', () => {
    const userId1 = arbitraryUserId();
    const userId2 = arbitraryUserId();
    const userId3 = arbitraryUserId();
    const groupId = arbitraryGroupId();
    const readModel = pipe(
      [
        constructEvent('UserAssignedAsAdminOfGroup')({
          userId: userId1,
          groupId,
        }),
        constructEvent('UserAssignedAsAdminOfGroup')({
          userId: userId2,
          groupId,
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it.todo('returns all those users as the admins');
  });

  describe('when the same user has been assigned as admin to this group and another group', () => {
    const userId = arbitraryUserId();
    const groupId1 = arbitraryGroupId();
    const groupId2 = arbitraryGroupId();

    const readModel = pipe(
      [
        constructEvent('UserAssignedAsAdminOfGroup')({
          userId,
          groupId: groupId1,
        }),
        constructEvent('UserAssignedAsAdminOfGroup')({
          userId,
          groupId: groupId2,
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it.todo('returns that user as an admin');
  });
});
