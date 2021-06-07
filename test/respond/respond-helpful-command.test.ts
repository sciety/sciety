import { respondHelpful } from '../../src/respond/respond-helpful-command';
import { arbitraryReviewId } from '../types/review-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

const userId = arbitraryUserId();
const reviewId = arbitraryReviewId();

describe('respond-helpful-command', () => {
  describe('none state for this review and user', () => {
    it('returns UserFoundReviewHelpful event', async () => {
      const events = respondHelpful('none', userId, reviewId);

      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject({
        type: 'UserFoundReviewHelpful',
        userId,
        reviewId,
      });
    });
  });

  describe('helpful state for this review and user', () => {
    it('returns no events', async () => {
      const events = respondHelpful('helpful', userId, reviewId);

      expect(events).toHaveLength(0);
    });
  });

  describe('not-helpful state for this review and user', () => {
    it('returns UserRevokedFindingReviewNotHelpful and UserFoundReviewHelpful events', async () => {
      const events = respondHelpful('not-helpful', userId, reviewId);

      expect(events).toHaveLength(2);
      expect(events[0]).toMatchObject({
        type: 'UserRevokedFindingReviewNotHelpful',
        userId,
        reviewId,
      });
      expect(events[1]).toMatchObject({
        type: 'UserFoundReviewHelpful',
        userId,
        reviewId,
      });
    });
  });
});
