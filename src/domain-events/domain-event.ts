import * as t from 'io-ts';
import { articleRemovedFromListEventCodec } from './article-removed-from-list-event';
import { evaluatedArticlesListSpecifiedEventCodec } from './evaluated-articles-list-specified-event';
import { evaluationPublicationRecordedEventCodec } from './evaluation-publication-recorded-event';
import { evaluationRemovalRecordedEventCodec } from './evaluation-removal-recorded-event';
import { evaluationUpdatedEventCodec } from './evaluation-updated-event';
import { expressionAddedToListEventCodec } from './expression-added-to-list-event';
import { expressionInListAnnotatedEventCodec } from './expression-in-list-annotated-event';
import { groupDetailsUpdatedEventCodec } from './group-details-updated-event';
import { groupJoinedEventCodec } from './group-joined-event';
import { incorrectlyRecordedEvaluationErasedEventCodec } from './incorrectly-recorded-evaluation-erased-event';
import { listCreatedEventCodec } from './list-created-event';
import { listDeletedEventCodec } from './list-deleted-event';
import { listDescriptionEditedEventCodec } from './list-description-edited-event';
import { listNameEditedEventCodec } from './list-name-edited-event';
import { listPromotionCreatedEventCodec } from './list-promotion-created-event';
import { listPromotionRemovedEventCodec } from './list-promotion-removed-event';
import { paperSnapshotRecordedEventCodec } from './paper-snapshot-recorded-event';
import { userAssignedAsAdminOfGroupEventCodec } from './user-assigned-as-admin-of-group-event';
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
  articleRemovedFromListEventCodec,
  expressionAddedToListEventCodec,
  expressionInListAnnotatedEventCodec,
  evaluatedArticlesListSpecifiedEventCodec,
  evaluationPublicationRecordedEventCodec,
  evaluationRemovalRecordedEventCodec,
  evaluationUpdatedEventCodec,
  groupDetailsUpdatedEventCodec,
  groupJoinedEventCodec,
  incorrectlyRecordedEvaluationErasedEventCodec,
  listCreatedEventCodec,
  listDeletedEventCodec,
  listDescriptionEditedEventCodec,
  listPromotionCreatedEventCodec,
  listPromotionRemovedEventCodec,
  listNameEditedEventCodec,
  paperSnapshotRecordedEventCodec,
  userAssignedAsAdminOfGroupEventCodec,
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
