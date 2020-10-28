import createVoteCommand from '../../src/vote/vote-command';

describe('vote-command', () => {
  describe('when no vote has been cast', () => {
    describe('and input contains an upvote', () => {
      // TODO: Test is incomplete
      it('produces an event containing an upvote', async () => {
        const commitEvents = jest.fn();
        const voteCommand = createVoteCommand(commitEvents);
        await voteCommand();

        expect(commitEvents).toHaveBeenCalledTimes(1);
      });

      it.todo('produces an event containing review ID');

      it.todo('produces an event containing user ID');
    });
  });
});
