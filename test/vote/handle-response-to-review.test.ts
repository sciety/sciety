import Doi from '../../src/types/doi';
import { generate } from '../../src/types/event-id';
import toUserId from '../../src/types/user-id';
import createHandleResponseToReview, { GetAllEvents } from '../../src/vote/handle-response-to-review';

describe('handle-response-to-review', () => {
  describe('when no vote has been cast', () => {
    describe('and input contains an upvote', () => {
      it('produces a UserFoundReviewHelpfulEvent', async () => {
        const commitEvents = jest.fn();
        const handleResponseToReview = createHandleResponseToReview(async () => [], commitEvents);
        await handleResponseToReview(
          { id: toUserId('anyuser') },
          new Doi('10.1111/123456'),
        );

        expect(commitEvents).toHaveBeenCalledTimes(1);
        expect(commitEvents).toHaveBeenCalledWith([
          expect.objectContaining({
            type: 'UserFoundReviewHelpful',
          }),
        ]);
      });

      it('produces a UserFoundReviewHelpfulEvent containing a review ID', async () => {
        const commitEvents = jest.fn();
        const handleResponseToReview = createHandleResponseToReview(async () => [], commitEvents);
        const reviewId = new Doi('10.1111/123456');
        await handleResponseToReview(
          { id: toUserId('anyuser') },
          reviewId,
        );

        expect(commitEvents).toHaveBeenCalledWith([
          expect.objectContaining({
            reviewId,
          }),
        ]);
      });

      it('produces an event containing user ID', async () => {
        const commitEvents = jest.fn();
        const handleResponseToReview = createHandleResponseToReview(async () => [], commitEvents);
        const userId = toUserId('currentuser');
        await handleResponseToReview(
          // TODO: pass in just a UserId?
          { id: userId },
          new Doi('10.1111/123456'),
        );

        expect(commitEvents).toHaveBeenCalledWith([
          expect.objectContaining({
            userId,
          }),
        ]);
      });
    });
  });

  describe('when an upvote has been cast', () => {
    describe('and input contains a revoke upvote', () => {
      it.todo('should fire a `vote revoked` event');
    });
  });

  describe('given no previous response when the user responds yes', () => {
    it.todo('trigger user responded yes event');
  });
});
