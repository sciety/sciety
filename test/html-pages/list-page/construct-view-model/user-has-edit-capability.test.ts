import * as O from 'fp-ts/Option';
import { userHasEditCapability } from '../../../../src/html-pages/list-page/construct-view-model/user-has-edit-capability.js';
import * as LOID from '../../../../src/types/list-owner-id.js';
import { arbitraryUserId } from '../../../types/user-id.helper.js';

describe('user-has-edit-capability', () => {
  describe('when the logged in user owns the list', () => {
    it('includes editing capability', async () => {
      const loggedInUserId = arbitraryUserId();
      const listOwnerId = LOID.fromUserId(loggedInUserId);
      const editCapability = userHasEditCapability(O.some(loggedInUserId), listOwnerId);

      expect(editCapability).toBe(true);
    });
  });

  describe('when the logged in user does not own the list', () => {
    it('does not include editing capability', async () => {
      const loggedInUserId = arbitraryUserId();
      const listOwnerId = LOID.fromUserId(arbitraryUserId());
      const editCapability = userHasEditCapability(O.some(loggedInUserId), listOwnerId);

      expect(editCapability).toBe(false);
    });
  });

  describe('when there is no logged in user', () => {
    it('does not include editing capability', async () => {
      const listOwnerId = LOID.fromUserId(arbitraryUserId());
      const editCapability = userHasEditCapability(O.none, listOwnerId);

      expect(editCapability).toBe(false);
    });
  });
});
