import * as A from 'fp-ts/Array';
import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { AnnotationCreatedEvent } from './annotation-created-event';
import { ArticleAddedToListEvent } from './article-added-to-list-event';
import { ArticleRemovedFromListEvent } from './article-removed-from-list-event';
import { EvaluationRecordedEvent } from './evaluation-recorded-event';
import { GroupJoinedEvent } from './group-joined-event';
import { ListCreatedEvent } from './list-created-event';
import { ListNameEditedEvent } from './list-name-edited-event';
import { SubjectAreaRecordedEvent } from './subject-area-recorded-event';
import { UserCreatedAccountEvent } from './user-created-account-event';
import { UserFollowedEditorialCommunityEvent } from './user-followed-editorial-community-event';
import { UserFoundReviewHelpfulEvent } from './user-found-review-helpful-event';
import { UserFoundReviewNotHelpfulEvent } from './user-found-review-not-helpful-event';
import { UserRevokedFindingReviewHelpfulEvent } from './user-revoked-finding-review-helpful-event';
import { UserRevokedFindingReviewNotHelpfulEvent } from './user-revoked-finding-review-not-helpful-event';
import { UserSavedArticleEvent } from './user-saved-article-event';
import { UserUnfollowedEditorialCommunityEvent } from './user-unfollowed-editorial-community-event';
import { UserUnsavedArticleEvent } from './user-unsaved-article-event';

export type DomainEvent =
  AnnotationCreatedEvent |
  ArticleAddedToListEvent |
  ArticleRemovedFromListEvent |
  SubjectAreaRecordedEvent |
  GroupJoinedEvent |
  EvaluationRecordedEvent |
  ListCreatedEvent |
  ListNameEditedEvent |
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
