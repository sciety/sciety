/* eslint-disable @typescript-eslint/no-unused-vars */
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, constructEvent } from '../../../src/domain-events';
import { getAdminsForAGroup } from '../../../src/read-models/group-authorisations/get-admins-for-a-group';
import { handleEvent, initialState } from '../../../src/read-models/group-authorisations/handle-event';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('get-admins-for-a-group', () => {
  const groupId = arbitraryGroupId();
  const runQuery = (events: ReadonlyArray<DomainEvent>) => {
    const readModel = pipe(
      events,
      RA.reduce(initialState(), handleEvent),
    );
    return getAdminsForAGroup(readModel)(groupId);
  };

  describe('when no user has been assigned as an admin of the group', () => {
    const result = runQuery([]);

    it('returns no admins', () => {
      expect(result).toHaveLength(0);
    });
  });

  describe('when a user has been assigned as an admin of the group', () => {
    const userId = arbitraryUserId();
    const result = runQuery([
      constructEvent('UserAssignedAsAdminOfGroup')({
        userId,
        groupId,
      }),
    ]);

    it.failing('returns that user as an admin', () => {
      expect(result).toStrictEqual([userId]);
    });
  });

  describe('when a user has been assigned as an admin of another group', () => {
    it.todo('returns no admins');
  });

  describe('when multiple users have been assigned as admins of the group', () => {
    const userId1 = arbitraryUserId();
    const userId2 = arbitraryUserId();
    const userId3 = arbitraryUserId();
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
