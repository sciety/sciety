import * as T from 'fp-ts/Task';
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
import { createAccountIfNecessary, UserAccount } from '../../src/user-account/create-account-if-necessary';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../helpers';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

const arbitraryUserAccount = (): UserAccount => ({
  id: arbitraryUserId(),
  handle: arbitraryWord(),
  avatarUrl: arbitraryUri(),
  displayName: arbitraryString(),
});

describe('create-account-if-necessary', () => {
  describe('when the user has already created an account', () => {
    describe('because there is a UserCreatedAccount event', () => {
      const userAccount = arbitraryUserAccount();
      const getAllEvents = T.of([
        userCreatedAccount(
          userAccount.id,
          userAccount.handle,
          userAccount.avatarUrl,
          userAccount.displayName,
        ),
      ]);
      const commitEvents = jest.fn(() => T.of(undefined));

      beforeEach(async () => {
        await createAccountIfNecessary({ getAllEvents, commitEvents })(userAccount)();
      });

      it.skip('raises no events', () => {
        expect(commitEvents).toHaveBeenCalledWith([]);
      });
    });

    describe('because there are already events initiated by this user, but no UserCreatedAccount event', () => {
      const userAccount = arbitraryUserAccount();

      describe.each([
        ['UserFollowedEditorialCommunityEvent', userFollowedEditorialCommunity(userAccount.id, arbitraryGroupId())],
        ['UserUnfollowedEditorialCommunityEvent', userUnfollowedEditorialCommunity(userAccount.id, arbitraryGroupId())],
        ['UserSavedArticleEvent', userSavedArticle(userAccount.id, arbitraryDoi())],
        ['UserUnsavedArticleEvent', userUnsavedArticle(userAccount.id, arbitraryDoi())],
        ['UserFoundReviewHelpfulEvent', userFoundReviewHelpful(userAccount.id, arbitraryReviewId())],
        ['UserRevokedFindingReviewHelpfulEvent', userRevokedFindingReviewHelpful(userAccount.id, arbitraryReviewId())],
        ['UserFoundReviewNotHelpfulEvent', userFoundReviewNotHelpful(userAccount.id, arbitraryReviewId())],
        ['UserRevokedFindingReviewNotHelpfulEvent', userRevokedFindingReviewNotHelpful(userAccount.id, arbitraryReviewId())],
      ])('when the existing event is %s', (_, event) => {
        const getAllEvents = T.of([event]);
        const commitEvents = jest.fn(() => T.of(undefined));

        beforeEach(async () => {
          await createAccountIfNecessary({ getAllEvents, commitEvents })(userAccount)();
        });

        it('raises no events', async () => {
          expect(commitEvents).toHaveBeenCalledWith([]);
        });
      });
    });
  });

  describe('when the user has not already created an account', () => {
    const userAccount = arbitraryUserAccount();
    const getAllEvents = T.of([]);
    const commitEvents = jest.fn(() => T.of(undefined));

    beforeEach(async () => {
      await createAccountIfNecessary({ getAllEvents, commitEvents })(userAccount)();
    });

    it.skip('raises a UserCreatedAccount event', () => {
      expect(commitEvents).toHaveBeenCalledWith([expect.objectContaining({
        userId: userAccount.id,
        handle: userAccount.handle,
      })]);
    });
  });

  describe('when another user has already created an account but this user has not', () => {
    const userAccount = arbitraryUserAccount();
    const anotherUserAccount = arbitraryUserAccount();
    const getAllEvents = T.of([
      userCreatedAccount(
        anotherUserAccount.id,
        anotherUserAccount.handle,
        anotherUserAccount.avatarUrl,
        anotherUserAccount.displayName,
      ),
    ]);
    const commitEvents = jest.fn(() => T.of(undefined));

    beforeEach(async () => {
      await createAccountIfNecessary({ getAllEvents, commitEvents })(userAccount)();
    });

    it.skip('raises a UserCreatedAccount event', () => {
      expect(commitEvents).toHaveBeenCalledWith([expect.objectContaining({
        userId: userAccount.id,
        handle: userAccount.handle,
      })]);
    });
  });
});
