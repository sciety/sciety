import {
  userCreatedAccount,
  userFollowedEditorialCommunity,
  userFoundReviewHelpful,
  userFoundReviewNotHelpful,
  userRevokedFindingReviewHelpful,
  userRevokedFindingReviewNotHelpful,
  userSavedArticle,
  userUnfollowedEditorialCommunity,
  userUnsavedArticle,
} from '../../src/domain-events';
import { updateSetOfUsersWithoutCreatedAccountEvents } from '../../src/policies/ensure-all-users-have-accounts';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('updateSetOfUsersWithoutCreatedAccountEvents', () => {
  const userId = arbitraryUserId();

  describe('when the userId has not been seen before', () => {
    describe('when the next event is UserCreatedAccount', () => {
      const readmodel = updateSetOfUsersWithoutCreatedAccountEvents(
        {},
        userCreatedAccount(userId, arbitraryWord(), arbitraryUri(), arbitraryString()),
      );

      it('the userId is marked as having an account', () => {
        expect(readmodel[userId]).toBe(true);
      });
    });

    describe.each([
      [userFollowedEditorialCommunity(userId, arbitraryGroupId())],
      [userUnfollowedEditorialCommunity(userId, arbitraryGroupId())],
      [userSavedArticle(userId, arbitraryArticleId())],
      [userUnsavedArticle(userId, arbitraryArticleId())],
      [userFoundReviewHelpful(userId, arbitraryReviewId())],
      [userFoundReviewNotHelpful(userId, arbitraryReviewId())],
      [userRevokedFindingReviewHelpful(userId, arbitraryReviewId())],
      [userRevokedFindingReviewNotHelpful(userId, arbitraryReviewId())],
    ])('when the next event is not UserCreatedAccount', (event) => {
      const readmodel = updateSetOfUsersWithoutCreatedAccountEvents({}, event);

      it('the userId is marked as not having an account', () => {
        expect(readmodel[userId]).toBe(false);
      });
    });
  });

  describe('when the userId has been seen before', () => {
    describe('when the next event is UserCreatedAccount', () => {
      it.todo('the userId is marked as having an account');
    });

    describe('when the next event is not UserCreatedAccount', () => {
      describe('and the user is already marked as having an account', () => {
        it.todo('the userId is still marked as having an account');
      });

      describe('and the user is already marked as not having an account', () => {
        it.todo('the userId is still marked as not having an account');
      });
    });
  });
});
