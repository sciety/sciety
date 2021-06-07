import { revokeResponse } from '../../src/respond/revoke-response-command';
import { Doi } from '../../src/types/doi';
import { arbitraryUserId } from '../types/user-id.helper';

describe('revoke-response-command', () => {
  describe('given no-response state for this review and user', () => {
    it('silently ignores the command', async () => {
      // TODO: extract reviewId and userId
      const reviewId = new Doi('10.1111/333333');
      const userId = arbitraryUserId();
      const events = revokeResponse('none', userId, reviewId);

      expect(events).toHaveLength(0);
    });
  });

  describe('given helpful state for this review and user', () => {
    it('return UserRevokedFindingReviewHelpful event', async () => {
      const reviewId = new Doi('10.1111/333333');
      const userId = arbitraryUserId();
      const events = revokeResponse('helpful', userId, new Doi('10.1111/333333'));

      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject({
        type: 'UserRevokedFindingReviewHelpful',
        reviewId,
        userId,
      });
    });
  });

  describe('given not-helpful state for this review and user', () => {
    it('return UserRevokedFindingReviewNotHelpful event', async () => {
      const reviewId = new Doi('10.1111/333333');
      const userId = arbitraryUserId();
      const events = revokeResponse('not-helpful', userId, new Doi('10.1111/333333'));

      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject({
        type: 'UserRevokedFindingReviewNotHelpful',
        reviewId,
        userId,
      });
    });
  });
});
