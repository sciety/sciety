import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
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
  RuntimeGeneratedEvent,
} from '../domain-events';
import { userCreatedAccount } from '../domain-events/user-created-account-event';
import { UserId } from '../types/user-id';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type CommitEvents = (event: ReadonlyArray<RuntimeGeneratedEvent>) => T.Task<void>;

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

// ts-unused-exports:disable-next-line
export type UserAccount = {
  id: UserId,
  handle: string,
  avatarUrl: string,
  displayName: string,
};

type CreateAccountIfNecessary = (ports: Ports) => (userAccount: UserAccount) => T.Task<void>;

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

export const createAccountIfNecessary: CreateAccountIfNecessary = ({
  getAllEvents,
  commitEvents,
}) => (
  user,
) => pipe(
  getAllEvents,
  T.map(shouldCreateAccount(user.id)),
  T.map(B.fold(
    () => [],
    () => [userCreatedAccount(user.id, user.handle, user.avatarUrl, user.displayName)],
  )),
  T.chain(commitEvents),
);
