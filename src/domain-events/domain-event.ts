import * as A from 'fp-ts/Array';
import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as t from 'io-ts';
import { AnnotationCreatedEvent, annotationCreatedEventCodec } from './annotation-created-event';
import { ArticleAddedToListEvent, articleAddedToListEventCodec } from './article-added-to-list-event';
import { ArticleRemovedFromListEvent, articleRemovedFromListEventCodec } from './article-removed-from-list-event';
import { EvaluationRecordedEvent, evaluationRecordedEventCodec } from './evaluation-recorded-event';
import { GroupJoinedEvent, groupJoinedEventCodec } from './group-joined-event';
import { ListCreatedEvent, listCreatedEventCodec } from './list-created-event';
import { SubjectAreaRecordedEvent, subjectAreaRecordedEventCodec } from './subject-area-recorded-event';
import { UserCreatedAccountEvent, userCreatedAccountEventCodec } from './user-created-account-event';
import { UserFollowedEditorialCommunityEvent, userFollowedEditorialCommunityEventCodec } from './user-followed-editorial-community-event';
import { UserFoundReviewHelpfulEvent, userFoundReviewHelpfulEventCodec } from './user-found-review-helpful-event';
import { UserFoundReviewNotHelpfulEvent, userFoundReviewNotHelpfulEventCodec } from './user-found-review-not-helpful-event';
import { UserRevokedFindingReviewHelpfulEvent, userRevokedFindingReviewHelpfulEventCodec } from './user-revoked-finding-review-helpful-event';
import { UserRevokedFindingReviewNotHelpfulEvent, userRevokedFindingReviewNotHelpfulEventCodec } from './user-revoked-finding-review-not-helpful-event';
import { UserSavedArticleEvent, userSavedArticleEventCodec } from './user-saved-article-event';
import { UserUnfollowedEditorialCommunityEvent, userUnfollowedEditorialCommunityEventCodec } from './user-unfollowed-editorial-community-event';
import { UserUnsavedArticleEvent, userUnsavedArticleEventCodec } from './user-unsaved-article-event';

export const domainEventCodec = t.union([
  annotationCreatedEventCodec,
  articleAddedToListEventCodec,
  articleRemovedFromListEventCodec,
  subjectAreaRecordedEventCodec,
  evaluationRecordedEventCodec,
  groupJoinedEventCodec,
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

export type DomainEvent =
  AnnotationCreatedEvent |
  ArticleAddedToListEvent |
  ArticleRemovedFromListEvent |
  SubjectAreaRecordedEvent |
  GroupJoinedEvent |
  EvaluationRecordedEvent |
  ListCreatedEvent |
  UserSavedArticleEvent |
  UserUnsavedArticleEvent |
  UserFollowedEditorialCommunityEvent |
  UserUnfollowedEditorialCommunityEvent |
  UserFoundReviewHelpfulEvent |
  UserRevokedFindingReviewHelpfulEvent |
  UserFoundReviewNotHelpfulEvent |
  UserRevokedFindingReviewNotHelpfulEvent |
  UserCreatedAccountEvent;

const byDate: Ord.Ord<DomainEvent> = pipe(
  D.Ord,
  Ord.contramap((event) => event.date),
);

const byUuid: Ord.Ord<DomainEvent> = pipe(
  S.Ord,
  Ord.contramap((event) => event.id),
);

export const sort = A.sortBy([byDate, byUuid]);
