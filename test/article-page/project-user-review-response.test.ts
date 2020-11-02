import { Maybe } from 'true-myth';
import createProjectUserReviewResponse from '../../src/article-page/project-user-review-response';
import Doi from '../../src/types/doi';
import { generate } from '../../src/types/event-id';
import toUserId from '../../src/types/user-id';

describe('project-user-review-response', () => {
  describe('no response events', () => {
    it('returns `not`', async () => {
      const projectUserReviewResponse = createProjectUserReviewResponse(async () => []);
      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), Maybe.just(toUserId('someone')));

      expect(userResponse).toBe('not');
    });
  });

  describe('one helpful response event', () => {
    it('returns `up`', async () => {
      const projectUserReviewResponse = createProjectUserReviewResponse(async () => [{
        type: 'UserFoundReviewHelpful',
        id: generate(),
        date: new Date(),
        userId: toUserId('user'),
        reviewId: new Doi('10.1111/123456'),
      }]);
      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), Maybe.just(toUserId('user')));

      expect(userResponse).toBe('up');
    });
  });

  describe('one helpful response event from another user', () => {
    it('returns `not`', async () => {
      const projectUserReviewResponse = createProjectUserReviewResponse(async () => [{
        type: 'UserFoundReviewHelpful',
        id: generate(),
        date: new Date(),
        userId: toUserId('userA'),
        reviewId: new Doi('10.1111/123456'),
      }]);
      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), Maybe.just(toUserId('userB')));

      expect(userResponse).toBe('not');
    });
  });

  describe('one helpful response event for another review from the same user', () => {
    it('returns `not`', async () => {
      const projectUserReviewResponse = createProjectUserReviewResponse(async () => [{
        type: 'UserFoundReviewHelpful',
        id: generate(),
        date: new Date(),
        userId: toUserId('user'),
        reviewId: new Doi('10.1111/987654'),
      }]);
      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), Maybe.just(toUserId('user')));

      expect(userResponse).toBe('not');
    });
  });

  describe('there is no user', () => {
    it('return `not`', async () => {
      const projectUserReviewResponse = createProjectUserReviewResponse(async () => [{
        type: 'UserFoundReviewHelpful',
        id: generate(),
        date: new Date(),
        userId: toUserId('some-user'),
        reviewId: new Doi('10.1111/123456'),
      }]);

      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), Maybe.nothing());

      expect(userResponse).toBe('not');
    });
  });

  describe('given no events', () => {
    it.todo('should return `not`');
  });

  describe('given `not`', () => {
    it.todo('returns `up` with a user responded yes event');

    it.todo('returns `down` with a user responded no event');
  });

  describe('given `up`', () => {
    it.todo('returns `not` with a user revoked response event');

    it.todo('returns `down` with a user responded no event');
  });

  describe('given `down`', () => {
    it.todo('returns `not` with a user revoked response event');

    it.todo('returns `up` with a user responded yes event');
  });
});
