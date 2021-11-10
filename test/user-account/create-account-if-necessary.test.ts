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
import { createAccountIfNecessary } from '../../src/user-account/create-account-if-necessary';
import { arbitraryWord } from '../helpers';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

const arbitraryUser = () => ({
  id: arbitraryUserId(),
  handle: arbitraryWord(),
});

describe('create-account-if-necessary', () => {
  describe('when the user has already created an account', () => {
    describe('because there is a UserCreatedAccount event', () => {
      const user = arbitraryUser();
      const getAllEvents = T.of([
        userCreatedAccount(user.id, user.handle),
      ]);
      const commitEvents = jest.fn(() => T.of(undefined));

      beforeEach(async () => {
        await createAccountIfNecessary({ getAllEvents, commitEvents })(user)();
      });

      it.skip('raises no events', () => {
        expect(commitEvents).toHaveBeenCalledWith([]);
      });
    });

    describe('because there are already events initiated by this user, but no UserCreatedAccount event', () => {
      const user = arbitraryUser();

      describe.each([
        ['UserFollowedEditorialCommunityEvent', userFollowedEditorialCommunity(user.id, arbitraryGroupId())],
        ['UserUnfollowedEditorialCommunityEvent', userUnfollowedEditorialCommunity(user.id, arbitraryGroupId())],
        ['UserSavedArticleEvent', userSavedArticle(user.id, arbitraryDoi())],
        ['UserUnsavedArticleEvent', userUnsavedArticle(user.id, arbitraryDoi())],
        ['UserFoundReviewHelpfulEvent', userFoundReviewHelpful(user.id, arbitraryReviewId())],
        ['UserRevokedFindingReviewHelpfulEvent', userRevokedFindingReviewHelpful(user.id, arbitraryReviewId())],
        ['UserFoundReviewNotHelpfulEvent', userFoundReviewNotHelpful(user.id, arbitraryReviewId())],
        ['UserRevokedFindingReviewNotHelpfulEvent', userRevokedFindingReviewNotHelpful(user.id, arbitraryReviewId())],
      ])('when the existing event is %s', (_, event) => {
        const getAllEvents = T.of([event]);
        const commitEvents = jest.fn(() => T.of(undefined));

        beforeEach(async () => {
          await createAccountIfNecessary({ getAllEvents, commitEvents })(user)();
        });

        it('raises no events', async () => {
          expect(commitEvents).toHaveBeenCalledWith([]);
        });
      });
    });
  });

  describe('when the user has not already created an account', () => {
    const user = arbitraryUser();
    const getAllEvents = T.of([]);
    const commitEvents = jest.fn(() => T.of(undefined));

    beforeEach(async () => {
      await createAccountIfNecessary({ getAllEvents, commitEvents })(user)();
    });

    it.skip('raises a UserCreatedAccount event', () => {
      expect(commitEvents).toHaveBeenCalledWith([expect.objectContaining({
        userId: user.id,
        handle: user.handle,
      })]);
    });
  });
});
