import createVoteCommand from '../../src/vote/vote-command';

describe('vote-command', () => {
  describe('when no vote has been cast', () => {
    describe('and input contains an upvote', () => {
      // TODO: Test is incomplete
      it('produces a UserFoundReviewHelpfulEvent', async () => {
        const commitEvents = jest.fn();
        const voteCommand = createVoteCommand(commitEvents);
        await voteCommand();

        expect(commitEvents).toHaveBeenCalledTimes(1);
        expect(commitEvents).toHaveBeenCalledWith([
          expect.objectContaining({
            type: 'UserFoundReviewHelpful',
          }),
        ]);
      });

      it.todo('produces an event containing review ID');

      it.todo('produces an event containing user ID');
    });
  });
});
