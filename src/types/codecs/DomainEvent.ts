import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types/DateFromISOString';
import { DoiFromString } from './DoiFromString';
import { EventIdFromString } from './EventIdFromString';
import { GroupIdFromString } from './GroupIdFromString';
import {
  listCreatedEventCodec,
  userCreatedAccountEventCodec,
  userFollowedEditorialCommunityEventCodec,
  userFoundReviewHelpfulEventCodec,
  userFoundReviewNotHelpfulEventCodec,
  userRevokedFindingReviewHelpfulEventCodec,
  userRevokedFindingReviewNotHelpfulEventCodec,
  userSavedArticleEventCodec,
  userUnfollowedEditorialCommunityEventCodec,
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

export const domainEvent = t.union([
  articleAddedToListEvent,
  evaluationRecordedEvent,
  listCreatedEventCodec,
  userCreatedAccountEventCodec,
  userFollowedEditorialCommunityEventCodec,
  userUnfollowedEditorialCommunityEventCodec,
  userFoundReviewHelpfulEventCodec,
  userFoundReviewNotHelpfulEventCodec,
  userRevokedFindingReviewHelpfulEventCodec,
  userRevokedFindingReviewNotHelpfulEventCodec,
  userSavedArticleEventCodec,
  userUnsavedArticleEventCodec,
], 'type');

export const domainEvents = t.readonlyArray(domainEvent);
