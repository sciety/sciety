import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
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
    it.todo('returns true');
  });

  describe('when multiple users have been assigned as admins of a group', () => {
    it.todo('returns true for all those users');

    it.todo('returns false for other users');
  });
});
