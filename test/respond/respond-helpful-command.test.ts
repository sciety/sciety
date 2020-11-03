import { GetAllEvents, respondHelpful } from '../../src/respond/respond-helpful-command';
import Doi from '../../src/types/doi';
import toUserId from '../../src/types/user-id';

describe('respond-helpful-command', () => {
  describe('no-response-state for this review and user', () => {
    it('return UserFoundReviewHelpful event', async () => {
      const userId = toUserId('someone');
      const reviewId = new Doi('10.1234/5678');
      const getAllEvents: GetAllEvents = async () => [];

      const events = await respondHelpful(getAllEvents)(userId, reviewId);

      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject({
        type: 'UserFoundReviewHelpful',
        userId,
        reviewId,
      });
    });
  });

  describe('helpful-state for this review and user', () => {
    it.todo('return no events');
  });

  describe('not-helpful-state for this review and user', () => {
    it.todo('return UserRevokedFindingReviewNotHelpful and UserFoundReviewHelpful events');
  });
});
