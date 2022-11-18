import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { CreateListCommand } from '../commands';
import {
  DomainEvent,
  isUserCreatedAccountEvent,
  isUserFollowedEditorialCommunityEvent,
  isUserFoundReviewHelpfulEvent,
  isUserFoundReviewNotHelpfulEvent,
  isUserRevokedFindingReviewHelpfulEvent,
  isUserRevokedFindingReviewNotHelpfulEvent,
  isUserSavedArticleEvent,
  isUserUnfollowedEditorialCommunityEvent,
  isUserUnsavedArticleEvent,
  userCreatedAccount,
} from '../domain-events';
import { executeCreateListCommand } from '../lists/execute-create-list-command';
import * as LOID from '../types/list-owner-id';
import { UserId } from '../types/user-id';

export type UserAccount = {
  id: UserId,
  handle: string,
  avatarUrl: string,
  displayName: string,
};

const isBreadcrumbInitiatedBy = (userId: UserId) => (event: DomainEvent) => (
  isUserFollowedEditorialCommunityEvent(event)
  || isUserUnfollowedEditorialCommunityEvent(event)
  || isUserSavedArticleEvent(event)
  || isUserUnsavedArticleEvent(event)
  || isUserFoundReviewHelpfulEvent(event)
  || isUserRevokedFindingReviewHelpfulEvent(event)
  || isUserFoundReviewNotHelpfulEvent(event)
  || isUserRevokedFindingReviewNotHelpfulEvent(event)
) && event.userId === userId;

const isAccountCreatedBy = (userId: UserId) => (event: DomainEvent) => (
  isUserCreatedAccountEvent(event)
) && event.userId === userId;

const shouldCreateAccount = (userId: UserId) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter((event) => (
    isBreadcrumbInitiatedBy(userId)(event)
     || isAccountCreatedBy(userId)(event)
  )),
  RA.isEmpty,
);

const constructCommand = (userDetails: { userId: UserId, handle: string }): CreateListCommand => ({
  ownerId: LOID.fromUserId(userDetails.userId),
  name: `@${userDetails.handle}'s saved articles`,
  description: `Articles that have been saved by @${userDetails.handle}`,
});
type SetUpUserIfNecessary = (user: UserAccount) => (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<DomainEvent>;

export const setUpUserIfNecessary: SetUpUserIfNecessary = (user) => (events) => pipe(
  events,
  shouldCreateAccount(user.id),
  B.fold(
    () => [],
    () => [
      userCreatedAccount(user.id, user.handle, user.avatarUrl, user.displayName),
      ...pipe(
        constructCommand({ userId: user.id, handle: user.handle }),
        executeCreateListCommand,
      ),
    ],
  ),
);
