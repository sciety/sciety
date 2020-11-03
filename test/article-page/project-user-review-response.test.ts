import { Maybe } from 'true-myth';
import createProjectUserReviewResponse from '../../src/article-page/project-user-review-response';
import Doi from '../../src/types/doi';
import { generate } from '../../src/types/event-id';
import toUserId from '../../src/types/user-id';

describe('project-user-review-response', () => {
  describe('no response events', () => {
    it('returns nothing', async () => {
      const projectUserReviewResponse = createProjectUserReviewResponse(async () => []);
      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), Maybe.just(toUserId('someone')));

      expect(userResponse.isNothing()).toBe(true);
    });
  });

  describe('one helpful response event', () => {
    it('returns `helpful`', async () => {
      const projectUserReviewResponse = createProjectUserReviewResponse(async () => [{
        type: 'UserFoundReviewHelpful',
        id: generate(),
        date: new Date(),
        userId: toUserId('user'),
        reviewId: new Doi('10.1111/123456'),
      }]);
      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), Maybe.just(toUserId('user')));

      expect(userResponse.unsafelyUnwrap()).toBe('helpful');
    });
  });

  describe('one helpful response event from another user', () => {
    it('returns nothing', async () => {
      const projectUserReviewResponse = createProjectUserReviewResponse(async () => [{
        type: 'UserFoundReviewHelpful',
        id: generate(),
        date: new Date(),
        userId: toUserId('userA'),
        reviewId: new Doi('10.1111/123456'),
      }]);
      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), Maybe.just(toUserId('userB')));

      expect(userResponse.isNothing()).toBe(true);
    });
  });

  describe('one helpful response event for another review from the same user', () => {
    it('returns nothing', async () => {
      const projectUserReviewResponse = createProjectUserReviewResponse(async () => [{
        type: 'UserFoundReviewHelpful',
        id: generate(),
        date: new Date(),
        userId: toUserId('user'),
        reviewId: new Doi('10.1111/987654'),
      }]);
      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), Maybe.just(toUserId('user')));

      expect(userResponse.isNothing()).toBe(true);
    });
  });

  describe('there is no user', () => {
    it('return nothing', async () => {
      const projectUserReviewResponse = createProjectUserReviewResponse(async () => [{
        type: 'UserFoundReviewHelpful',
        id: generate(),
        date: new Date(),
        userId: toUserId('some-user'),
        reviewId: new Doi('10.1111/123456'),
      }]);

      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), Maybe.nothing());

      expect(userResponse.isNothing()).toBe(true);
    });
  });

  describe('one revoked helpful response', () => {
    it('returns no-response', async () => {
      const userId = toUserId('some-user');
      const reviewId = new Doi('10.1111/123456');
      const projectUserReviewResponse = createProjectUserReviewResponse(async () => [
        {
          type: 'UserFoundReviewHelpful',
          id: generate(),
          date: new Date(),
          userId,
          reviewId,
        },
        {
          type: 'UserRevokedFindingReviewHelpful',
          id: generate(),
          date: new Date(),
          userId,
          reviewId,
        },
      ]);

      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), Maybe.just(userId));

      expect(userResponse.isNothing()).toBe(true);
    });
  });
});
