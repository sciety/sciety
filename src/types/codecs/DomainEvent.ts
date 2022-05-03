import * as t from 'io-ts';
import {
  annotationCreatedEventCodec,
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

export const domainEventCodec = t.union([
  annotationCreatedEventCodec,
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
