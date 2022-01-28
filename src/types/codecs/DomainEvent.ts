import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types/DateFromISOString';
import { DoiFromString } from './DoiFromString';
import { EventIdFromString } from './EventIdFromString';
import { GroupIdFromString } from './GroupIdFromString';
import { UserIdFromString } from './UserIdFromString';
import {
  userCreatedAccountEventCodec,
  userRevokedFindingReviewNotHelpfulEventCodec,
  userSavedArticleEventCodec,
  userUnsavedArticleEventCodec,
} from '../../domain-events';
import { reviewIdCodec } from '../review-id';

const articleAddedToListEvent = t.type({
  id: EventIdFromString,
  type: t.literal('ArticleAddedToList'),
  date: DateFromISOString,
  articleId: DoiFromString,
  listId: t.string,
});

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

const listCreatedEvent = t.type({
  id: EventIdFromString,
  type: t.literal('ListCreated'),
  date: DateFromISOString,
  listId: t.string,
  name: t.string,
  description: t.string,
  ownerId: GroupIdFromString,
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

export const domainEvent = t.union([
  articleAddedToListEvent,
  evaluationRecordedEvent,
  listCreatedEvent,
  userCreatedAccountEventCodec,
  userFollowedEditorialCommunityEvent,
  userUnfollowedEditorialCommunityEvent,
  userFoundReviewHelpfulEvent,
  userFoundReviewNotHelpfulEvent,
  userRevokedFindingReviewHelpfulEvent,
  userRevokedFindingReviewNotHelpfulEventCodec,
  userSavedArticleEventCodec,
  userUnsavedArticleEventCodec,
], 'type');

export const domainEvents = t.readonlyArray(domainEvent);
