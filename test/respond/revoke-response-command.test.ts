import { revokeResponse } from '../../src/respond/revoke-response-command';
import Doi from '../../src/types/doi';
import toUserId from '../../src/types/user-id';

describe('revoke-response-command', () => {
  describe('given no-response state for this review and user', () => {
    it.todo('error');
  });

  describe('given helpful state for this review and user', () => {
    it('return UserRevokedFindingReviewHelpful event', async () => {
      const reviewId = new Doi('10.1111/333333');
      const userId = toUserId('someone');
      const events = await revokeResponse()(userId, reviewId);

      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject({
        type: 'UserRevokedFindingReviewHelpful',
        reviewId,
        userId,
      });
    });
  });

  describe('given not-helpful state for this review and user', () => {
    it.todo('return UserRevokedFindingReviewNotHelpful event');
  });
});
