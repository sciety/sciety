import * as O from 'fp-ts/Option';
import { projectUserReviewResponse } from '../../../src/article-page/activity-page/project-user-review-response';
import {
  userFoundReviewHelpful,
  userFoundReviewNotHelpful,
  userRevokedFindingReviewHelpful,
  userRevokedFindingReviewNotHelpful,
} from '../../../src/domain-events';
import { arbitraryReviewId } from '../../types/review-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('project-user-review-response', () => {
  describe('no response events', () => {
    it('returns nothing', async () => {
      const events = async () => [];
      const userResponse = await projectUserReviewResponse(events)(arbitraryReviewId(), O.some(arbitraryUserId()))();

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one helpful response event', () => {
    it('returns `helpful`', async () => {
      const userId = arbitraryUserId();
      const reviewId = arbitraryReviewId();
      const events = async () => [
        userFoundReviewHelpful(userId, reviewId),
      ];
      const userResponse = await projectUserReviewResponse(events)(reviewId, O.some(userId))();

      expect(userResponse).toStrictEqual(O.some('helpful'));
    });
  });

  describe('one helpful response event from another user', () => {
    it('returns nothing', async () => {
      const reviewId = arbitraryReviewId();
      const events = async () => [
        userFoundReviewHelpful(arbitraryUserId(), reviewId),
      ];
      const userResponse = await projectUserReviewResponse(events)(reviewId, O.some(arbitraryUserId()))();

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one helpful response event for another review from the same user', () => {
    it('returns nothing', async () => {
      const userId = arbitraryUserId();
      const events = async () => [
        userFoundReviewHelpful(userId, arbitraryReviewId()),
      ];
      const userResponse = await projectUserReviewResponse(events)(arbitraryReviewId(), O.some(userId))();

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('there is no user', () => {
    it('return nothing', async () => {
      const reviewId = arbitraryReviewId();
      const events = async () => [
        userFoundReviewHelpful(arbitraryUserId(), reviewId),
      ];
      const userResponse = await projectUserReviewResponse(events)(reviewId, O.none)();

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one revoked helpful response', () => {
    it('returns no-response', async () => {
      const userId = arbitraryUserId();
      const reviewId = arbitraryReviewId();
      const events = async () => [
        userFoundReviewHelpful(userId, reviewId),
        userRevokedFindingReviewHelpful(userId, reviewId),
      ];
      const userResponse = await projectUserReviewResponse(events)(arbitraryReviewId(), O.some(userId))();

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one revoked helpful response on a different review', () => {
    it('doesn\'t change the state of the current review', async () => {
      const userId = arbitraryUserId();
      const reviewId = arbitraryReviewId();
      const otherReviewId = arbitraryReviewId();
      const events = async () => [
        userFoundReviewHelpful(userId, reviewId),
        userFoundReviewHelpful(userId, otherReviewId),
        userRevokedFindingReviewHelpful(userId, otherReviewId),
      ];
      const userResponse = await projectUserReviewResponse(events)(reviewId, O.some(userId))();

      expect(userResponse).toStrictEqual(O.some('helpful'));
    });
  });

  describe('one not helpful response event', () => {
    it('returns `not helpful`', async () => {
      const userId = arbitraryUserId();
      const reviewId = arbitraryReviewId();
      const events = async () => [
        userFoundReviewNotHelpful(userId, reviewId),
      ];
      const userResponse = await projectUserReviewResponse(events)(reviewId, O.some(userId))();

      expect(userResponse).toStrictEqual(O.some('not-helpful'));
    });
  });

  describe('one revoked not-helpful response', () => {
    it('returns nothing', async () => {
      const userId = arbitraryUserId();
      const reviewId = arbitraryReviewId();
      const events = async () => [
        userFoundReviewNotHelpful(userId, reviewId),
        userRevokedFindingReviewNotHelpful(userId, reviewId),
      ];
      const userResponse = await projectUserReviewResponse(events)(reviewId, O.some(userId))();

      expect(userResponse).toStrictEqual(O.none);
    });
  });
});
