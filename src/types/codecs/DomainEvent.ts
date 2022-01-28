import * as t from 'io-ts';
import {
  articleAddedToListEventCodec,
  evaluationRecordedEventCodec,
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

export const domainEvent = t.union([
  articleAddedToListEventCodec,
  evaluationRecordedEventCodec,
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
