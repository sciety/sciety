import * as O from 'fp-ts/Option';
import { projectUserReviewResponse } from '../../src/article-page/project-user-review-response';
import { Doi } from '../../src/types/doi';
import {
  userFoundReviewHelpful,
  userFoundReviewNotHelpful,
  userRevokedFindingReviewHelpful,
  userRevokedFindingReviewNotHelpful,
} from '../../src/types/domain-events';
import { toUserId } from '../../src/types/user-id';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('project-user-review-response', () => {
  describe('no response events', () => {
    it('returns nothing', async () => {
      const events = async () => [];

      const userResponse = await projectUserReviewResponse(arbitraryReviewId(), O.some(toUserId('someone')))(events)();

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one helpful response event', () => {
    it('returns `helpful`', async () => {
      const events = async () => [
        userFoundReviewHelpful(toUserId('user'), new Doi('10.1111/123456')),
      ];

      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), O.some(toUserId('user')))(events)();

      expect(userResponse).toStrictEqual(O.some('helpful'));
    });
  });

  describe('one helpful response event from another user', () => {
    it('returns nothing', async () => {
      const events = async () => [
        userFoundReviewHelpful(toUserId('userA'), new Doi('10.1111/123456')),
      ];

      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), O.some(toUserId('userB')))(events)();

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one helpful response event for another review from the same user', () => {
    it('returns nothing', async () => {
      const events = async () => [
        userFoundReviewHelpful(toUserId('user'), arbitraryReviewId()),
      ];

      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), O.some(toUserId('user')))(events)();

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('there is no user', () => {
    it('return nothing', async () => {
      const events = async () => [
        userFoundReviewHelpful(toUserId('some-user'), new Doi('10.1111/123456')),
      ];

      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), O.none)(events)();

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one revoked helpful response', () => {
    it('returns no-response', async () => {
      const userId = toUserId('some-user');
      const reviewId = arbitraryReviewId();
      const events = async () => [
        userFoundReviewHelpful(userId, reviewId),
        userRevokedFindingReviewHelpful(userId, reviewId),
      ];

      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), O.some(userId))(events)();

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one revoked helpful response on a different review', () => {
    it('doesn\'t change the state of the current review', async () => {
      const userId = toUserId('some-user');
      const reviewId = arbitraryReviewId();
      const otherReviewId = arbitraryReviewId();
      const events = async () => [
        userFoundReviewHelpful(userId, reviewId),
        userFoundReviewHelpful(userId, otherReviewId),
        userRevokedFindingReviewHelpful(userId, otherReviewId),
      ];

      const userResponse = await projectUserReviewResponse(reviewId, O.some(userId))(events)();

      expect(userResponse).toStrictEqual(O.some('helpful'));
    });
  });

  describe('one not helpful response event', () => {
    it('returns `not helpful`', async () => {
      const events = async () => [
        userFoundReviewNotHelpful(toUserId('user'), new Doi('10.1111/123456')),
      ];

      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), O.some(toUserId('user')))(events)();

      expect(userResponse).toStrictEqual(O.some('not-helpful'));
    });
  });

  describe('one revoked not-helpful response', () => {
    it('returns nothing', async () => {
      const userId = toUserId('some-user');
      const reviewId = new Doi('10.1111/123456');
      const events = async () => [
        userFoundReviewNotHelpful(userId, reviewId),
        userRevokedFindingReviewNotHelpful(userId, reviewId),
      ];

      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), O.some(userId))(events)();

      expect(userResponse).toStrictEqual(O.none);
    });
  });
});
