import createHandleResponseToReview, { CommandHandler } from '../../src/respond/handle-response-to-review';
import Doi from '../../src/types/doi';
import { UserFoundReviewHelpfulEvent } from '../../src/types/domain-events';
import { generate } from '../../src/types/event-id';
import toUserId from '../../src/types/user-id';

describe('handle-response-to-review', () => {
  describe('when no response has been given', () => {
    describe('when the user says it is helpful', () => {
      it('commits the event', async () => {
        const userId = toUserId('anyuser');
        const reviewId = new Doi('10.1111/123456');
        const commitEvents = jest.fn();
        const event: UserFoundReviewHelpfulEvent = {
          id: generate(),
          type: 'UserFoundReviewHelpful',
          date: new Date(),
          userId,
          reviewId,
        };
        const respondHelpful: CommandHandler = async () => [event];
        const handleResponseToReview = createHandleResponseToReview(respondHelpful, commitEvents);
        await handleResponseToReview(
          { id: userId },
          reviewId,
          'respond-helpful',
        );

        expect(commitEvents).toHaveBeenCalledTimes(1);
        expect(commitEvents).toHaveBeenCalledWith([event]);
      });
    });
  });

  describe('when a helpful response has been given', () => {
    describe('and input contains a revoke response', () => {
      it.todo('commits the event');
    });
  });
});
