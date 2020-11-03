import { GetAllEvents, revokeResponse } from '../../src/respond/revoke-response-command';
import Doi from '../../src/types/doi';
import { generate } from '../../src/types/event-id';
import toUserId from '../../src/types/user-id';

describe('revoke-response-command', () => {
  describe('given no-response state for this review and user', () => {
    it('silently ignores the command', async () => {
      const reviewId = new Doi('10.1111/333333');
      const userId = toUserId('someone');
      const getAllEvents: GetAllEvents = async () => [];
      const events = await revokeResponse(getAllEvents)(userId, reviewId);

      expect(events).toHaveLength(0);
    });
  });

  describe('given helpful state for this review and user', () => {
    it('return UserRevokedFindingReviewHelpful event', async () => {
      const reviewId = new Doi('10.1111/333333');
      const userId = toUserId('someone');
      const getAllEvents: GetAllEvents = async () => [
        {
          id: generate(),
          date: new Date(),
          type: 'UserFoundReviewHelpful',
          userId,
          reviewId,
        },
      ];
      const events = await revokeResponse(getAllEvents)(userId, reviewId);

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
