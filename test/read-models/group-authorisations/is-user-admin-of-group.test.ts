import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events';
import { handleEvent, initialState } from '../../../src/read-models/group-authorisations/handle-event';
import { isUserAdminOfGroup } from '../../../src/read-models/group-authorisations/is-user-admin-of-group';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('is-user-admin-of-group', () => {
  describe('when no user has been assigned as an admin of a group', () => {
    const userId = arbitraryUserId();
    const groupId = arbitraryGroupId();
    const readModel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns false', () => {
      expect(isUserAdminOfGroup(readModel)(userId, groupId)).toBe(false);
    });
  });

  describe('when a user has been assigned as an admin of a group', () => {
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

    it('returns true', () => {
      expect(isUserAdminOfGroup(readModel)(userId, groupId)).toBe(true);
    });
  });

  describe('when multiple users have been assigned as admins of the same group', () => {
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

    it('returns true for all those users', () => {
      expect(isUserAdminOfGroup(readModel)(userId1, groupId)).toBe(true);
      expect(isUserAdminOfGroup(readModel)(userId2, groupId)).toBe(true);
    });

    it('returns false for other users', () => {
      expect(isUserAdminOfGroup(readModel)(userId3, groupId)).toBe(false);
    });
  });

  describe('when the same user has been assigned as admin to multiple groups', () => {
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

    it('returns true for each of these groups', () => {
      expect(isUserAdminOfGroup(readModel)(userId, groupId1)).toBe(true);
      expect(isUserAdminOfGroup(readModel)(userId, groupId2)).toBe(true);
    });

    it('returns false for a different group', () => {
      expect(isUserAdminOfGroup(readModel)(userId, arbitraryGroupId())).toBe(false);
    });
  });
});
