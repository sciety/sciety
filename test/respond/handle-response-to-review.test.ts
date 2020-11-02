import createHandleResponseToReview, { CommandHandler } from '../../src/respond/handle-response-to-review';
import Doi from '../../src/types/doi';
import { UserFoundReviewHelpfulEvent } from '../../src/types/domain-events';
import { generate } from '../../src/types/event-id';
import toUserId from '../../src/types/user-id';
import shouldNotBeCalled from '../should-not-be-called';

describe('handle-response-to-review', () => {
  describe('and the input contains a helpful response', () => {
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
      const handleResponseToReview = createHandleResponseToReview(
        respondHelpful,
        shouldNotBeCalled,
        commitEvents,
      );
      await handleResponseToReview(
        { id: userId },
        reviewId,
        'respond-helpful',
      );

      expect(commitEvents).toHaveBeenCalledTimes(1);
      expect(commitEvents).toHaveBeenCalledWith([event]);
    });
  });

  describe('and input contains a revoke response', () => {
    it.todo('commits the event');
  });
});
