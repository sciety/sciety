import * as t from 'io-ts';
import { articleAddedToListEventCodec } from './article-added-to-list-event';
import { articleInListAnnotatedEventCodec } from './article-in-list-annotated-event';
import { articleRemovedFromListEventCodec } from './article-removed-from-list-event';
import { evaluatedArticlesListSpecifiedEventCodec } from './evaluated-articles-list-specified-event';
import { evaluationPublicationRecordedEventCodec } from './evaluation-publication-recorded-event';
import { evaluationRemovalRecordedEventCodec } from './evaluation-removal-recorded-event';
import { evaluationUpdatedEventCodec } from './evaluation-updated-event';
import { groupDetailsUpdatedEventCodec } from './group-details-updated-event';
import { groupJoinedEventCodec } from './group-joined-event';
import { incorrectlyRecordedEvaluationErasedEventCodec } from './incorrectly-recorded-evaluation-erased-event';
import { listCreatedEventCodec } from './list-created-event';
import { listDescriptionEditedEventCodec } from './list-description-edited-event';
import { listNameEditedEventCodec } from './list-name-edited-event';
import { listPromotionCreatedEventCodec } from './list-promotion-created-event';
import { subjectAreaRecordedEventCodec } from './subject-area-recorded-event';
import { userCreatedAccountEventCodec } from './user-created-account-event';
import { userDetailsUpdatedEventCodec } from './user-details-updated-event';
import { userFollowedEditorialCommunityEventCodec } from './user-followed-editorial-community-event';
import { userFoundReviewHelpfulEventCodec } from './user-found-review-helpful-event';
import { userFoundReviewNotHelpfulEventCodec } from './user-found-review-not-helpful-event';
import { userRevokedFindingReviewHelpfulEventCodec } from './user-revoked-finding-review-helpful-event';
import { userRevokedFindingReviewNotHelpfulEventCodec } from './user-revoked-finding-review-not-helpful-event';
import { userSavedArticleEventCodec } from './user-saved-article-event';
import { userUnfollowedEditorialCommunityEventCodec } from './user-unfollowed-editorial-community-event';
import { userUnsavedArticleEventCodec } from './user-unsaved-article-event';

export const domainEventCodec = t.union([
  articleAddedToListEventCodec,
  articleInListAnnotatedEventCodec,
  articleRemovedFromListEventCodec,
  evaluatedArticlesListSpecifiedEventCodec,
  evaluationPublicationRecordedEventCodec,
  evaluationRemovalRecordedEventCodec,
  evaluationUpdatedEventCodec,
  groupDetailsUpdatedEventCodec,
  groupJoinedEventCodec,
  incorrectlyRecordedEvaluationErasedEventCodec,
  listCreatedEventCodec,
  listDescriptionEditedEventCodec,
  listPromotionCreatedEventCodec,
  listNameEditedEventCodec,
  subjectAreaRecordedEventCodec,
  userCreatedAccountEventCodec,
  userDetailsUpdatedEventCodec,
  userFollowedEditorialCommunityEventCodec,
  userFoundReviewHelpfulEventCodec,
  userFoundReviewNotHelpfulEventCodec,
  userRevokedFindingReviewHelpfulEventCodec,
  userRevokedFindingReviewNotHelpfulEventCodec,
  userSavedArticleEventCodec,
  userUnfollowedEditorialCommunityEventCodec,
  userUnsavedArticleEventCodec,
], 'type');

export type DomainEvent = t.TypeOf<typeof domainEventCodec>;

export type EventName = DomainEvent['type'];

export type EventOfType<T extends EventName> = DomainEvent & { 'type': T };

export const isEventOfType = <T extends EventName>(name: T) => (
  event: DomainEvent,
): event is EventOfType<T> => event.type === name;
