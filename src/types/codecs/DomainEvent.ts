import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types/DateFromISOString';
import { DoiFromString } from './DoiFromString';
import { EventIdFromString } from './EventIdFromString';
import { GroupIdFromString } from './GroupIdFromString';
import { UserIdFromString } from './UserIdFromString';
import { reviewIdCodec } from '../review-id';

const evaluationRecordedEvent = t.type({
  id: EventIdFromString,
  type: t.literal('EvaluationRecorded'),
  date: DateFromISOString,
  groupId: GroupIdFromString,
  evaluationLocator: reviewIdCodec,
  articleId: DoiFromString,
  publishedAt: DateFromISOString,
  authors: t.readonlyArray(t.string),
});

const userFollowedEditorialCommunityEvent = t.type({
  id: EventIdFromString,
  type: t.literal('UserFollowedEditorialCommunity'),
  date: DateFromISOString,
  userId: UserIdFromString,
  editorialCommunityId: GroupIdFromString,
});

const userUnfollowedEditorialCommunityEvent = t.type({
  id: EventIdFromString,
  type: t.literal('UserUnfollowedEditorialCommunity'),
  date: DateFromISOString,
  userId: UserIdFromString,
  editorialCommunityId: GroupIdFromString,
});

const userFoundReviewHelpfulEvent = t.type({
  id: EventIdFromString,
  type: t.literal('UserFoundReviewHelpful'),
  date: DateFromISOString,
  userId: UserIdFromString,
  reviewId: reviewIdCodec,
});

const userFoundReviewNotHelpfulEvent = t.type({
  id: EventIdFromString,
  type: t.literal('UserFoundReviewNotHelpful'),
  date: DateFromISOString,
  userId: UserIdFromString,
  reviewId: reviewIdCodec,
});

const userRevokedFindingReviewHelpfulEvent = t.type({
  id: EventIdFromString,
  type: t.literal('UserRevokedFindingReviewHelpful'),
  date: DateFromISOString,
  userId: UserIdFromString,
  reviewId: reviewIdCodec,
});

const userRevokedFindingReviewNotHelpfulEvent = t.type({
  id: EventIdFromString,
  type: t.literal('UserRevokedFindingReviewNotHelpful'),
  date: DateFromISOString,
  userId: UserIdFromString,
  reviewId: reviewIdCodec,
});

const userSavedArticleEvent = t.type({
  id: EventIdFromString,
  type: t.literal('UserSavedArticle'),
  date: DateFromISOString,
  userId: UserIdFromString,
  articleId: DoiFromString,
});

const userUnsavedArticleEvent = t.type({
  id: EventIdFromString,
  type: t.literal('UserUnsavedArticle'),
  date: DateFromISOString,
  userId: UserIdFromString,
  articleId: DoiFromString,
});

const userCreatedAccountEvent = t.type({
  id: EventIdFromString,
  type: t.literal('UserCreatedAccount'),
  date: DateFromISOString,
  userId: UserIdFromString,
  handle: t.string,
  avatarUrl: t.string,
  displayName: t.string,
});

export const domainEvent = t.union([
  evaluationRecordedEvent,
  userFollowedEditorialCommunityEvent,
  userUnfollowedEditorialCommunityEvent,
  userFoundReviewHelpfulEvent,
  userFoundReviewNotHelpfulEvent,
  userRevokedFindingReviewHelpfulEvent,
  userRevokedFindingReviewNotHelpfulEvent,
  userSavedArticleEvent,
  userUnsavedArticleEvent,
  userCreatedAccountEvent,
], 'type');

export const domainEvents = t.readonlyArray(domainEvent);
