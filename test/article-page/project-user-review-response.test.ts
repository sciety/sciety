import * as O from 'fp-ts/Option';
import { projectUserReviewResponse } from '../../src/article-page/project-user-review-response';
import { Doi } from '../../src/types/doi';
import {
  userFoundReviewHelpful,
  userFoundReviewNotHelpful,
  userRevokedFindingReviewHelpful, userRevokedFindingReviewNotHelpful,
} from '../../src/types/domain-events';
import { toUserId } from '../../src/types/user-id';

describe('project-user-review-response', () => {
  describe('no response events', () => {
    it('returns nothing', async () => {
      const project = projectUserReviewResponse(async () => []);
      const userResponse = await project(new Doi('10.1111/123456'), O.some(toUserId('someone')))();

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one helpful response event', () => {
    it('returns `helpful`', async () => {
      const project = projectUserReviewResponse(
        async () => [userFoundReviewHelpful(toUserId('user'), new Doi('10.1111/123456'))],
      );
      const userResponse = await project(new Doi('10.1111/123456'), O.some(toUserId('user')))();

      expect(userResponse).toStrictEqual(O.some('helpful'));
    });
  });

  describe('one helpful response event from another user', () => {
    it('returns nothing', async () => {
      const project = projectUserReviewResponse(
        async () => [userFoundReviewHelpful(toUserId('userA'), new Doi('10.1111/123456'))],
      );
      const userResponse = await project(new Doi('10.1111/123456'), O.some(toUserId('userB')))();

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one helpful response event for another review from the same user', () => {
    it('returns nothing', async () => {
      const project = projectUserReviewResponse(
        async () => [userFoundReviewHelpful(toUserId('user'), new Doi('10.1111/987654'))],
      );
      const userResponse = await project(new Doi('10.1111/123456'), O.some(toUserId('user')))();

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('there is no user', () => {
    it('return nothing', async () => {
      const project = projectUserReviewResponse(
        async () => [userFoundReviewHelpful(toUserId('some-user'), new Doi('10.1111/123456'))],
      );

      const userResponse = await project(new Doi('10.1111/123456'), O.none)();

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one revoked helpful response', () => {
    it('returns no-response', async () => {
      const userId = toUserId('some-user');
      const reviewId = new Doi('10.1111/123456');
      const project = projectUserReviewResponse(
        async () => [
          userFoundReviewHelpful(userId, reviewId),
          userRevokedFindingReviewHelpful(userId, reviewId),
        ],
      );

      const userResponse = await project(new Doi('10.1111/123456'), O.some(userId))();

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one revoked helpful response on a different review', () => {
    it('doesn\'t change the state of the current review', async () => {
      const userId = toUserId('some-user');
      const reviewId = new Doi('10.1111/123456');
      const otherReviewId = new Doi('10.1111/987654');
      const project = projectUserReviewResponse(
        async () => [
          userFoundReviewHelpful(userId, reviewId),
          userFoundReviewHelpful(userId, otherReviewId),
          userRevokedFindingReviewHelpful(userId, otherReviewId),
        ],
      );

      const userResponse = await project(reviewId, O.some(userId))();

      expect(userResponse).toStrictEqual(O.some('helpful'));
    });
  });

  describe('one not helpful response event', () => {
    it('returns `not helpful`', async () => {
      const project = projectUserReviewResponse(
        async () => [
          userFoundReviewNotHelpful(toUserId('user'), new Doi('10.1111/123456'))],
      );
      const userResponse = await project(new Doi('10.1111/123456'), O.some(toUserId('user')))();

      expect(userResponse).toStrictEqual(O.some('not-helpful'));
    });
  });

  describe('one revoked not-helpful response', () => {
    it('returns nothing', async () => {
      const userId = toUserId('some-user');
      const reviewId = new Doi('10.1111/123456');
      const project = projectUserReviewResponse(
        async () => [
          userFoundReviewNotHelpful(userId, reviewId),
          userRevokedFindingReviewNotHelpful(userId, reviewId),
        ],
      );

      const userResponse = await project(new Doi('10.1111/123456'), O.some(userId))();

      expect(userResponse).toStrictEqual(O.none);
    });
  });
});
