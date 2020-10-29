import createProjectUserVote from '../../src/article-page/project-user-vote';
import Doi from '../../src/types/doi';
import { generate } from '../../src/types/event-id';
import toUserId from '../../src/types/user-id';

describe('project-user-vote', () => {
  describe('no vote events', () => {
    it('returns `not`', async () => {
      const projectUserVote = createProjectUserVote(async () => []);
      const vote = await projectUserVote(toUserId('someone'));

      expect(vote).toBe('not');
    });
  });

  describe('one up vote event', () => {
    it('returns `up`', async () => {
      const projectUserVote = createProjectUserVote(async () => [{
        type: 'UserFoundReviewHelpful',
        id: generate(),
        date: new Date(),
        userId: toUserId('user'),
        reviewId: new Doi('10.1111/123456'),
      }]);
      const vote = await projectUserVote(toUserId('user'));

      expect(vote).toBe('up');
    });
  });

  describe('one up vote event from another user', () => {
    it.todo('returns `not`');
  });

  describe('one up vote event for another review', () => {
    it.todo('returns `not`');
  });
});
