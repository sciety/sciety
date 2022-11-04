import * as O from 'fp-ts/Option';
import { articleControls } from '../../../src/generic-list-page/articles-list/article-controls';
import { fromGroupId, fromUserId } from '../../../src/types/list-owner-id';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('article-controls', () => {
  describe('when the list owner is a user', () => {
    describe('when the logged in user is the list owner', () => {
      const userId = arbitraryUserId();
      const listOwnerId = fromUserId(userId);
      const loggedInUserId = O.some(userId);

      it('has controls', () => {
        expect(articleControls(listOwnerId, loggedInUserId)).toBe(true);
      });
    });

    describe('when the logged in user is not the list owner', () => {
      const listOwnerId = fromUserId(arbitraryUserId());
      const loggedInUserId = O.some(arbitraryUserId());

      it('has no controls', () => {
        expect(articleControls(listOwnerId, loggedInUserId)).toBe(false);
      });
    });

    describe('when the user is not logged in', () => {
      const listOwnerId = fromUserId(arbitraryUserId());
      const loggedInUserId = O.none;

      it('has no controls', () => {
        expect(articleControls(listOwnerId, loggedInUserId)).toBe(false);
      });
    });
  });

  describe('when the list owner is a group', () => {
    const listOwnerId = fromGroupId(arbitraryGroupId());
    const irrelevantLoggedInUserId = O.none;

    it('has no controls', () => {
      expect(articleControls(listOwnerId, irrelevantLoggedInUserId)).toBe(false);
    });
  });
});
