import Doi from '../../src/types/doi';
import toUserId from '../../src/types/user-id';
import createVoteCommand from '../../src/vote/vote-command';

describe('vote-command', () => {
  describe('when no vote has been cast', () => {
    describe('and input contains an upvote', () => {
      it('produces a UserFoundReviewHelpfulEvent', async () => {
        const commitEvents = jest.fn();
        const voteCommand = createVoteCommand(commitEvents);
        await voteCommand(
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
        const voteCommand = createVoteCommand(commitEvents);
        const reviewId = new Doi('10.1111/123456');
        await voteCommand(
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
        const voteCommand = createVoteCommand(commitEvents);
        const userId = toUserId('currentuser');
        await voteCommand(
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
});
