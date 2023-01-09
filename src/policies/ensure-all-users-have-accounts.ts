/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import * as T from 'fp-ts/Task';
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
  UserFollowedEditorialCommunityEvent,
  UserFoundReviewHelpfulEvent,
  UserFoundReviewNotHelpfulEvent,
  UserRevokedFindingReviewHelpfulEvent,
  UserRevokedFindingReviewNotHelpfulEvent,
  UserSavedArticleEvent,
  UserUnfollowedEditorialCommunityEvent,
  UserUnsavedArticleEvent,
} from '../domain-events';
import {
  Logger,
} from '../infrastructure';
import { GetUserDetailsBatch } from '../third-parties/twitter';
import * as UID from '../types/user-id';
import { createAccountIfNecessary, Ports as CreateAccountIfNecessaryPorts } from '../user-account/create-account-if-necessary';

type ReadModel = Record<UID.UserId, boolean>;

type UserAction = UserFollowedEditorialCommunityEvent
| UserUnfollowedEditorialCommunityEvent
| UserSavedArticleEvent
| UserUnsavedArticleEvent
| UserFoundReviewHelpfulEvent
| UserFoundReviewNotHelpfulEvent
| UserRevokedFindingReviewHelpfulEvent
| UserRevokedFindingReviewNotHelpfulEvent;

const isUserAction = (event: DomainEvent): event is UserAction => isUserFollowedEditorialCommunityEvent(event)
|| isUserUnfollowedEditorialCommunityEvent(event)
|| isUserSavedArticleEvent(event)
|| isUserUnsavedArticleEvent(event)
|| isUserFoundReviewHelpfulEvent(event)
|| isUserFoundReviewNotHelpfulEvent(event)
|| isUserRevokedFindingReviewHelpfulEvent(event)
|| isUserRevokedFindingReviewNotHelpfulEvent(event);

// ts-unused-exports:disable-next-line
export const updateSetOfUsersWithoutCreatedAccountEvents = (state: ReadModel, event: DomainEvent) => {
  if (isUserCreatedAccountEvent(event)) {
    state[event.userId] = true;
  }
  if (isUserAction(event)) {
    state[event.userId] = state[event.userId] || false;
  }
  return state;
};

// ts-unused-exports:disable-next-line
export const selectUserIdsWithoutAccount = (readModel: ReadModel): ReadonlyArray<UID.UserId> => pipe(
  readModel,
  R.filter((hasAccount) => hasAccount === false),
  Object.keys,
  RA.map(UID.fromValidatedString),
);

type EnsureAllUsersHaveCreatedAccountEvents = (
  events: ReadonlyArray<DomainEvent>,
  ports: {
    getUserDetailsBatch: GetUserDetailsBatch,
    logger: Logger,
  } & CreateAccountIfNecessaryPorts
) => T.Task<unknown>;

export const ensureAllUsersHaveCreatedAccountEvents: EnsureAllUsersHaveCreatedAccountEvents = (events, ports) => pipe(
  events,
  RA.reduce({}, updateSetOfUsersWithoutCreatedAccountEvents),
  selectUserIdsWithoutAccount,
  (userIds) => {
    ports.logger('debug', 'ensureAllUsersHaveCreatedAccountEvents', { countOfUserIds: userIds.length });
    return userIds;
  },
  RA.mapWithIndex((index, userId) => ({
    id: userId,
    displayName: `Unknown user ${index + 1}`,
    handle: `unknown_user_${index + 1}`,
    avatarUrl: '/static/images/profile-dark.svg',
  })),
  T.traverseArray(createAccountIfNecessary(ports)),
);
