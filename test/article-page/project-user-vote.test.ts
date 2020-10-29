import { Maybe } from 'true-myth';
import createProjectUserVote from '../../src/article-page/project-user-vote';
import Doi from '../../src/types/doi';
import { generate } from '../../src/types/event-id';
import toUserId from '../../src/types/user-id';

describe('project-user-vote', () => {
  describe('no vote events', () => {
    it('returns `not`', async () => {
      const projectUserVote = createProjectUserVote(async () => []);
      const vote = await projectUserVote(new Doi('10.1111/123456'), Maybe.just(toUserId('someone')));

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
      const vote = await projectUserVote(new Doi('10.1111/123456'), Maybe.just(toUserId('user')));

      expect(vote).toBe('up');
    });
  });

  describe('one up vote event from another user', () => {
    it('returns `not`', async () => {
      const projectUserVote = createProjectUserVote(async () => [{
        type: 'UserFoundReviewHelpful',
        id: generate(),
        date: new Date(),
        userId: toUserId('userA'),
        reviewId: new Doi('10.1111/123456'),
      }]);
      const vote = await projectUserVote(new Doi('10.1111/123456'), Maybe.just(toUserId('userB')));

      expect(vote).toBe('not');
    });
  });

  describe('one up vote event for another review from the same user', () => {
    it('returns `not`', async () => {
      const projectUserVote = createProjectUserVote(async () => [{
        type: 'UserFoundReviewHelpful',
        id: generate(),
        date: new Date(),
        userId: toUserId('user'),
        reviewId: new Doi('10.1111/987654'),
      }]);
      const vote = await projectUserVote(new Doi('10.1111/123456'), Maybe.just(toUserId('user')));

      expect(vote).toBe('not');
    });
  });

  describe('there is no user', () => {
    it('return `not`', async () => {
      const projectUserVote = createProjectUserVote(async () => [{
        type: 'UserFoundReviewHelpful',
        id: generate(),
        date: new Date(),
        userId: toUserId('some-user'),
        reviewId: new Doi('10.1111/123456'),
      }]);

      const vote = await projectUserVote(new Doi('10.1111/123456'), Maybe.nothing());

      expect(vote).toBe('not');
    });
  });
});
