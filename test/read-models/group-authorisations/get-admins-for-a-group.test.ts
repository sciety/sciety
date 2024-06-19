/* eslint-disable @typescript-eslint/no-unused-vars */
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../src/domain-events';
import { getAdminsForAGroup } from '../../../src/read-models/group-authorisations/get-admins-for-a-group';
import { handleEvent, initialState } from '../../../src/read-models/group-authorisations/handle-event';
import { arbitraryUserAssignedAsAdminOfGroupEvent } from '../../domain-events/group-authorisation-resource-events.helper';
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
      {
        ...arbitraryUserAssignedAsAdminOfGroupEvent(),
        userId,
        groupId,
      },
    ]);

    it('returns that user as an admin', () => {
      expect(result).toStrictEqual([userId]);
    });
  });

  describe('when a user has been assigned as an admin of another group', () => {
    const result = runQuery([
      arbitraryUserAssignedAsAdminOfGroupEvent(),
    ]);

    it('returns no admins', () => {
      expect(result).toHaveLength(0);
    });
  });

  describe('when multiple users have been assigned as admins of the group', () => {
    const userId1 = arbitraryUserId();
    const userId2 = arbitraryUserId();
    const result = runQuery(
      [
        {
          ...arbitraryUserAssignedAsAdminOfGroupEvent(),
          userId: userId1,
          groupId,
        },
        {
          ...arbitraryUserAssignedAsAdminOfGroupEvent(),
          userId: userId2,
          groupId,
        },
      ],
    );

    it('returns all those users as the admins', () => {
      expect(result).toHaveLength(2);
      expect(result).toContain(userId1);
      expect(result).toContain(userId2);
    });
  });

  describe('when the same user has been assigned as admin to this group and another group', () => {
    const userId = arbitraryUserId();

    const result = runQuery(
      [
        {
          ...arbitraryUserAssignedAsAdminOfGroupEvent(),
          userId,
          groupId,
        },
        {
          ...arbitraryUserAssignedAsAdminOfGroupEvent(),
          userId,
        },
      ],
    );

    it('returns that user as an admin', () => {
      expect(result).toStrictEqual([userId]);
    });
  });
});
