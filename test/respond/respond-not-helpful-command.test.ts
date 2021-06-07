import { respondNotHelpful } from '../../src/respond/respond-not-helpful-command';
import { arbitraryReviewId } from '../types/review-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

const userId = arbitraryUserId();
const reviewId = arbitraryReviewId();

describe('respond-not-helpful-command', () => {
  describe('no-response-state for this review and user', () => {
    it('returns UserFoundReviewNotHelpful event', async () => {
      const events = respondNotHelpful('none', userId, reviewId);

      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject({
        type: 'UserFoundReviewNotHelpful',
        userId,
        reviewId,
      });
    });
  });

  describe('not-helpful-state for this review and user', () => {
    it('returns no events', async () => {
      const events = respondNotHelpful('not-helpful', userId, reviewId);

      expect(events).toHaveLength(0);
    });
  });

  describe('helpful-state for this review and user', () => {
    it('returns UserRevokedFindingReviewNotHelpful and UserFoundReviewHelpful events', async () => {
      const events = respondNotHelpful('helpful', userId, reviewId);

      expect(events).toHaveLength(2);
      expect(events[0]).toMatchObject({
        type: 'UserRevokedFindingReviewHelpful',
        userId,
        reviewId,
      });
      expect(events[1]).toMatchObject({
        type: 'UserFoundReviewNotHelpful',
        userId,
        reviewId,
      });
    });
  });
});
