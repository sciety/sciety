import { GetAllEvents, revokeResponse } from '../../src/respond/revoke-response-command';
import Doi from '../../src/types/doi';
import { generate } from '../../src/types/event-id';
import toUserId from '../../src/types/user-id';

describe('revoke-response-command', () => {
  describe('given no-response state for this review and user', () => {
    it('silently ignores the command', async () => {
      // TODO: extract reviewId and userId
      const reviewId = new Doi('10.1111/333333');
      const userId = toUserId('someone');
      const getAllEvents: GetAllEvents = async () => [];
      const events = await revokeResponse(getAllEvents)(userId, reviewId);

      expect(events).toHaveLength(0);
    });
  });

  describe('given helpful state for this review and a different user', () => {
    it('silently ignores the command', async () => {
      const reviewId = new Doi('10.1111/333333');
      const userId = toUserId('someone');
      const differentUserId = toUserId('someone-else');

      const getAllEvents: GetAllEvents = async () => [{
        // TODO: only show relevant event properties in input
        id: generate(),
        date: new Date(),
        type: 'UserFoundReviewHelpful',
        userId: differentUserId,
        reviewId,
      },
      ];
      const events = await revokeResponse(getAllEvents)(userId, reviewId);

      expect(events).toHaveLength(0);
    });
  });

  describe('given helpful state for a different review and this user', () => {
    it('silently ignores the command', async () => {
      const reviewId = new Doi('10.1111/333333');
      const userId = toUserId('someone');
      const differentReviewId = new Doi('10.1101/666666');

      const getAllEvents: GetAllEvents = async () => [{
        id: generate(),
        date: new Date(),
        type: 'UserFoundReviewHelpful',
        userId,
        reviewId: differentReviewId,
      },
      ];
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
      const events = await revokeResponse(getAllEvents)(userId, new Doi('10.1111/333333'));

      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject({
        type: 'UserRevokedFindingReviewHelpful',
        reviewId,
        userId,
      });
    });
  });

  describe('given the user has already revoked', () => {
    it('silently ignores the command', async () => {
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
        {
          id: generate(),
          date: new Date(),
          type: 'UserRevokedFindingReviewHelpful',
          userId,
          reviewId,
        },
      ];
      const events = await revokeResponse(getAllEvents)(userId, reviewId);

      expect(events).toHaveLength(0);
    });
  });

  describe('given not-helpful state for this review and user', () => {
    it.todo('return UserRevokedFindingReviewNotHelpful event');
  });
});
