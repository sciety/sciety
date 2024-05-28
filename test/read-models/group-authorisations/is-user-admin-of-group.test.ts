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
    const result = isUserAdminOfGroup(readModel)(userId, groupId);

    it('returns false', () => {
      expect(result).toBe(false);
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
    const result = isUserAdminOfGroup(readModel)(userId, groupId);

    it('returns true', () => {
      expect(result).toBe(true);
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
    const result1 = isUserAdminOfGroup(readModel)(userId1, groupId);
    const result2 = isUserAdminOfGroup(readModel)(userId2, groupId);

    const result3 = isUserAdminOfGroup(readModel)(userId3, groupId);

    it('returns true for all those users', () => {
      expect(result1).toBe(true);
      expect(result2).toBe(true);
    });

    it('returns false for other users', () => {
      expect(result3).toBe(false);
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
    const result1 = isUserAdminOfGroup(readModel)(userId, groupId1);
    const result2 = isUserAdminOfGroup(readModel)(userId, groupId2);

    it('returns true for each of these groups', () => {
      expect(result1).toBe(true);
      expect(result2).toBe(true);
    });

    it.todo('returns false for a different group');
  });
});
