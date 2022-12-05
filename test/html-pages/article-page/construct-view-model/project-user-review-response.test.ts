import * as O from 'fp-ts/Option';
import {
  userFoundReviewHelpful,
  userFoundReviewNotHelpful,
  userRevokedFindingReviewHelpful,
  userRevokedFindingReviewNotHelpful,
} from '../../../../src/domain-events';
import { projectUserReviewResponse } from '../../../../src/html-pages/article-page/construct-view-model/project-user-review-response';
import { User } from '../../../../src/types/user';
import { arbitraryString, arbitraryUri } from '../../../helpers';
import { arbitraryReviewId } from '../../../types/review-id.helper';
import { arbitraryUserId } from '../../../types/user-id.helper';

const arbitraryUser = (): User => ({
  id: arbitraryUserId(),
  handle: arbitraryString(),
  avatarUrl: arbitraryUri(),
});

describe('project-user-review-response', () => {
  describe('no response events', () => {
    it('returns nothing', async () => {
      const events = async () => [];
      const userResponse = await projectUserReviewResponse(events)(arbitraryReviewId(), O.some(arbitraryUser()))();

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one helpful response event', () => {
    it('returns `helpful`', async () => {
      const user = arbitraryUser();
      const reviewId = arbitraryReviewId();
      const events = async () => [
        userFoundReviewHelpful(user.id, reviewId),
      ];
      const userResponse = await projectUserReviewResponse(events)(reviewId, O.some(user))();

      expect(userResponse).toStrictEqual(O.some('helpful'));
    });
  });

  describe('one helpful response event from another user', () => {
    it('returns nothing', async () => {
      const reviewId = arbitraryReviewId();
      const events = async () => [
        userFoundReviewHelpful(arbitraryUser().id, reviewId),
      ];
      const userResponse = await projectUserReviewResponse(events)(reviewId, O.some(arbitraryUser()))();

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one helpful response event for another review from the same user', () => {
    it('returns nothing', async () => {
      const user = arbitraryUser();
      const events = async () => [
        userFoundReviewHelpful(user.id, arbitraryReviewId()),
      ];
      const userResponse = await projectUserReviewResponse(events)(arbitraryReviewId(), O.some(user))();

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('there is no user', () => {
    it('return nothing', async () => {
      const reviewId = arbitraryReviewId();
      const events = async () => [
        userFoundReviewHelpful(arbitraryUser().id, reviewId),
      ];
      const userResponse = await projectUserReviewResponse(events)(reviewId, O.none)();

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one revoked helpful response', () => {
    it('returns no-response', async () => {
      const user = arbitraryUser();
      const reviewId = arbitraryReviewId();
      const events = async () => [
        userFoundReviewHelpful(user.id, reviewId),
        userRevokedFindingReviewHelpful(user.id, reviewId),
      ];
      const userResponse = await projectUserReviewResponse(events)(arbitraryReviewId(), O.some(user))();

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one revoked helpful response on a different review', () => {
    it('doesn\'t change the state of the current review', async () => {
      const user = arbitraryUser();
      const reviewId = arbitraryReviewId();
      const otherReviewId = arbitraryReviewId();
      const events = async () => [
        userFoundReviewHelpful(user.id, reviewId),
        userFoundReviewHelpful(user.id, otherReviewId),
        userRevokedFindingReviewHelpful(user.id, otherReviewId),
      ];
      const userResponse = await projectUserReviewResponse(events)(reviewId, O.some(user))();

      expect(userResponse).toStrictEqual(O.some('helpful'));
    });
  });

  describe('one not helpful response event', () => {
    it('returns `not helpful`', async () => {
      const user = arbitraryUser();
      const reviewId = arbitraryReviewId();
      const events = async () => [
        userFoundReviewNotHelpful(user.id, reviewId),
      ];
      const userResponse = await projectUserReviewResponse(events)(reviewId, O.some(user))();

      expect(userResponse).toStrictEqual(O.some('not-helpful'));
    });
  });

  describe('one revoked not-helpful response', () => {
    it('returns nothing', async () => {
      const user = arbitraryUser();
      const reviewId = arbitraryReviewId();
      const events = async () => [
        userFoundReviewNotHelpful(user.id, reviewId),
        userRevokedFindingReviewNotHelpful(user.id, reviewId),
      ];
      const userResponse = await projectUserReviewResponse(events)(reviewId, O.some(user))();

      expect(userResponse).toStrictEqual(O.none);
    });
  });
});
