import createProjectUserVote from '../../src/article-page/project-user-vote';
import toUserId from '../../src/types/user-id';

describe('project-user-vote', () => {
  describe('no vote events', () => {
    it('returns `not`', async () => {
      const projectUserVote = createProjectUserVote();
      const vote = await projectUserVote(toUserId('someone'));

      expect(vote).toBe('not');
    });
  });

  describe('one up vote event', () => {
    it.todo('returns `up`');
  });

  describe('one up vote event from another user', () => {
    it.todo('returns `not`');
  });

  describe('one up vote event for another review', () => {
    it.todo('returns `not`');
  });
});
