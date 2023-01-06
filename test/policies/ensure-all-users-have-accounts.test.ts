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
import { selectUserIdsWithoutAccount, updateSetOfUsersWithoutCreatedAccountEvents } from '../../src/policies/ensure-all-users-have-accounts';
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
      const readmodel = updateSetOfUsersWithoutCreatedAccountEvents(
        { [userId]: false },
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
      describe('and the user is already marked as having an account', () => {
        const readmodel = updateSetOfUsersWithoutCreatedAccountEvents(
          { [userId]: true },
          event,
        );

        it('the userId is still marked as having an account', () => {
          expect(readmodel[userId]).toBe(true);
        });
      });

      describe('and the user is already marked as not having an account', () => {
        const readmodel = updateSetOfUsersWithoutCreatedAccountEvents(
          { [userId]: false },
          event,
        );

        it('the userId is still marked as not having an account', () => {
          expect(readmodel[userId]).toBe(false);
        });
      });
    });
  });
});

describe('selectUserIdsWithoutAccount', () => {
  const userId1 = arbitraryUserId();
  const userId2 = arbitraryUserId();
  const userId3 = arbitraryUserId();
  const userId4 = arbitraryUserId();
  const result = selectUserIdsWithoutAccount({
    [userId1]: true,
    [userId2]: true,
    [userId3]: false,
    [userId4]: false,
  });

  it('ignores userIds that are set to true', () => {
    expect(result).toStrictEqual([
      userId3,
      userId4,
    ]);
  });
});
