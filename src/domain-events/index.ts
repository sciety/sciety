import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as t from 'io-ts';
import * as A from 'fp-ts/Array';
import * as RA from 'fp-ts/ReadonlyArray';
import { curationStatementRecordedEventCodec } from './curation-statement-recorded-event';
import { annotationCreatedEventCodec, articleInListAnnotatedEventCodec } from './article-in-list-annotated-event';
import { articleAddedToListEventCodec } from './article-added-to-list-event';
import { articleRemovedFromListEventCodec } from './article-removed-from-list-event';
import { evaluatedArticlesListSpecifiedEventCodec } from './evaluated-articles-list-specified-event';
import { evaluationRemovalRecordedEventCodec } from './evaluation-removal-recorded-event';
import { evaluationUpdatedEventCodec } from './evaluation-updated-event';
import { groupJoinedEventCodec } from './group-joined-event';
import { listCreatedEventCodec } from './list-created-event';
import { listDescriptionEditedEventCodec } from './list-description-edited-event';
import { listNameEditedEventCodec } from './list-name-edited-event';
import { subjectAreaRecordedEventCodec } from './subject-area-recorded-event';
import { userCreatedAccountEventCodec } from './user-created-account-event';
import { userFollowedEditorialCommunityEventCodec } from './user-followed-editorial-community-event';
import { userFoundReviewHelpfulEventCodec } from './user-found-review-helpful-event';
import { userFoundReviewNotHelpfulEventCodec } from './user-found-review-not-helpful-event';
import { userRevokedFindingReviewHelpfulEventCodec } from './user-revoked-finding-review-helpful-event';
import { userRevokedFindingReviewNotHelpfulEventCodec } from './user-revoked-finding-review-not-helpful-event';
import { userSavedArticleEventCodec } from './user-saved-article-event';
import { userUnfollowedEditorialCommunityEventCodec } from './user-unfollowed-editorial-community-event';
import { userUnsavedArticleEventCodec } from './user-unsaved-article-event';
import { userDetailsUpdatedEventCodec } from './user-details-updated-event';
import { incorrectlyRecordedEvaluationErasedEventCodec } from './incorrectly-recorded-evaluation-erased-event';
import { EventId, generate } from '../types/event-id';
import { groupDetailsUpdatedEventCodec } from './group-details-updated-event';
import { evaluationPublicationRecordedEventV1Codec, evaluationRecordedEventCodec } from './evaluation-publication-recorded-event';

const byDate: Ord.Ord<DomainEvent> = pipe(
  D.Ord,
  Ord.contramap((event) => event.date),
);

const byUuid: Ord.Ord<DomainEvent> = pipe(
  S.Ord,
  Ord.contramap((event) => event.id),
);

export const sort = A.sortBy([byDate, byUuid]);

const legacyDomainEventCodec = t.union([
  evaluationRecordedEventCodec,
  curationStatementRecordedEventCodec,
  annotationCreatedEventCodec,
], 'type');

export const domainEventCodec = t.union([
  articleAddedToListEventCodec,
  articleInListAnnotatedEventCodec,
  articleRemovedFromListEventCodec,
  evaluatedArticlesListSpecifiedEventCodec,
  evaluationPublicationRecordedEventV1Codec,
  evaluationRemovalRecordedEventCodec,
  evaluationUpdatedEventCodec,
  groupDetailsUpdatedEventCodec,
  groupJoinedEventCodec,
  incorrectlyRecordedEvaluationErasedEventCodec,
  listCreatedEventCodec,
  listDescriptionEditedEventCodec,
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

export const currentOrLegacyDomainEventCodec = t.union([
  domainEventCodec,
  legacyDomainEventCodec,
], 'type');

export type CurrentOrLegacyDomainEvent = t.TypeOf<typeof currentOrLegacyDomainEventCodec>;

export type DomainEvent = t.TypeOf<typeof domainEventCodec>;

type EventName = DomainEvent['type'];

export type EventOfType<T extends EventName> = DomainEvent & { 'type': T };

export const isEventOfType = <T extends EventName>(name: T) => (
  event: DomainEvent,
): event is EventOfType<T> => event.type === name;

type EventSpecificFields<T extends EventName> = Omit<EventOfType<T>, 'type' | 'id' | 'date'>;

type EventBase<T> = {
  id: EventId,
  date: Date,
  type: T,
};

export const constructEvent = <
T extends EventName,
A extends EventSpecificFields<T>,
>(type: T) => (args: A & Partial<{ date: Date }>): EventBase<T> & A => ({
    type,
    id: generate(),
    date: new Date(),
    ...args,
  });

type SubsetOfDomainEvent<Names extends Array<EventName>> = Extract<DomainEvent, { type: Names[number] }>;

export const filterByName = <T extends Array<EventName>>(names: T) => (
  events: ReadonlyArray<DomainEvent>,
): ReadonlyArray<SubsetOfDomainEvent<T>> => pipe(
  events,
  RA.filter(({ type }) => names.includes(type)),
  RA.map((filtered) => filtered as SubsetOfDomainEvent<T>),
);
