import Doi from '../../src/types/doi';
import createVoteCommand from '../../src/vote/vote-command';

describe('vote-command', () => {
  describe('when no vote has been cast', () => {
    describe('and input contains an upvote', () => {
      // TODO: Test is incomplete
      it('produces a UserFoundReviewHelpfulEvent', async () => {
        const commitEvents = jest.fn();
        const voteCommand = createVoteCommand(commitEvents);
        await voteCommand(new Doi('10.1111/123456'));

        expect(commitEvents).toHaveBeenCalledTimes(1);
        expect(commitEvents).toHaveBeenCalledWith([
          expect.objectContaining({
            type: 'UserFoundReviewHelpful',
          }),
        ]);
      });

      it('produces a UserFoundReviewHelpfulEvent containing a review ID', async () => {
        const commitEvents = jest.fn();
        const voteCommand = createVoteCommand(commitEvents);
        const reviewId = new Doi('10.1111/123456');
        await voteCommand(reviewId);

        expect(commitEvents).toHaveBeenCalledTimes(1);
        expect(commitEvents).toHaveBeenCalledWith([
          expect.objectContaining({
            reviewId,
          }),
        ]);
      });

      it.todo('produces an event containing user ID');
    });
  });
});
