import Doi from '../../src/types/doi';
import { generate } from '../../src/types/event-id';
import toUserId from '../../src/types/user-id';
import createVoteCommand, { GetAllEvents } from '../../src/vote/vote-command';

describe('vote-command', () => {
  describe('when no vote has been cast', () => {
    describe('and input contains an upvote', () => {
      it('produces a UserFoundReviewHelpfulEvent', async () => {
        const commitEvents = jest.fn();
        const voteCommand = createVoteCommand(async () => [], commitEvents);
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
        const voteCommand = createVoteCommand(async () => [], commitEvents);
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
        const voteCommand = createVoteCommand(async () => [], commitEvents);
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

  describe('when an upvote has been cast', () => {
    describe('and input contains an upvote from the same user', () => {
      it('does not produce an event', async () => {
        const userId = toUserId('currentuser');
        const reviewId = new Doi('10.1111/123456');
        const getAllEvents: GetAllEvents = async () => [
          {
            id: generate(),
            type: 'UserFoundReviewHelpful',
            date: new Date(),
            userId,
            reviewId,
          },
        ];
        const commitEvents = jest.fn();
        const voteCommand = createVoteCommand(getAllEvents, commitEvents);

        await voteCommand({ id: userId }, reviewId);

        expect(commitEvents).not.toHaveBeenCalled();
      });
    });

    describe('and input contains a revoke upvote', () => {
      it.todo('should fire a `vote revoked` event');
    });
  });

  describe('given no previous response when the user responds yes', () => {
    it.todo('trigger user responded yes event');
  });
});
