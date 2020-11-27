import { respondHelpful } from '../../src/respond/respond-helpful-command';
import Doi from '../../src/types/doi';
import toUserId from '../../src/types/user-id';

const userId = toUserId('someone');
const reviewId = new Doi('10.1234/5678');

describe('respond-helpful-command', () => {
  describe('none state for this review and user', () => {
    it('returns UserFoundReviewHelpful event', async () => {
      const events = await respondHelpful('none')(userId, reviewId);

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
      const events = await respondHelpful('helpful')(userId, reviewId);

      expect(events).toHaveLength(0);
    });
  });

  describe('not-helpful state for this review and user', () => {
    it('returns UserRevokedFindingReviewNotHelpful and UserFoundReviewHelpful events', async () => {
      const events = await respondHelpful('not-helpful')(userId, reviewId);

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
