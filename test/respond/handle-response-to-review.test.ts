import createHandleResponseToReview from '../../src/respond/handle-response-to-review';
import Doi from '../../src/types/doi';
import toUserId from '../../src/types/user-id';
import UserResponseToReview from '../../src/types/user-response-to-review';

describe('handle-response-to-review', () => {
  describe('when no response has been given', () => {
    describe('when the user says it is helpful', () => {
      it('commits the event', async () => {
        const commitEvents = jest.fn();
        const handleResponseToReview = createHandleResponseToReview(
          async () => new UserResponseToReview(toUserId('anyuser'), new Doi('10.1111/123456')), async () => [], commitEvents,
        );
        await handleResponseToReview(
          { id: toUserId('anyuser') },
          new Doi('10.1111/123456'),
          'respond-helpful',
        );

        expect(commitEvents).toHaveBeenCalledTimes(1);
        expect(commitEvents).toHaveBeenCalledWith([
          expect.objectContaining({
            type: 'UserFoundReviewHelpful',
          }),
        ]);
      });
    });
  });

  describe('when a helpful response has been given', () => {
    describe('and input contains a revoke response', () => {
      it.todo('commits the event');
    });
  });
});
