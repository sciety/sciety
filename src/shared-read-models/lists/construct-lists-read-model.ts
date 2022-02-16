import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RS from 'fp-ts/ReadonlySet';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { List } from './list';
import { DomainEvent, EvaluationRecordedEvent, ListCreatedEvent } from '../../domain-events';
import { GroupId } from '../../types/group-id';

// this should use ListId as key, to allow a group to have multiple lists
type ReadModel = Map<GroupId, List>;

const calculateArticleCount = (ownerId: GroupId) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter((event): event is EvaluationRecordedEvent => event.type === 'EvaluationRecorded'),
  RA.filter((event) => event.groupId === ownerId),
  RA.map((event) => event.articleId.value),
  (articleIds) => (new Set(articleIds)),
  RS.size,
);

const calculateLastUpdated = (ownerId: GroupId, listCreationDate: Date) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter((event): event is EvaluationRecordedEvent => event.type === 'EvaluationRecorded'),
  RA.filter((event) => event.groupId === ownerId),
  RA.last,
  O.map((event) => event.date),
  O.getOrElse(() => listCreationDate),
);

export const constructListsReadModel = (
  events: ReadonlyArray<DomainEvent>,
): T.Task<ReadModel> => pipe(
  events,
  RA.filter((event): event is ListCreatedEvent => event.type === 'ListCreated'),
  RA.map((event) => ({
    ...event,
    articleCount: 0,
    lastUpdated: event.date,
  })),
  T.traverseArray((list) => pipe(
    T.of(undefined),
    T.delay(10),
    T.map(() => ({
      ...list,
      articleCount: pipe(events, calculateArticleCount(list.ownerId)),
      lastUpdated: pipe(
        events,
        calculateLastUpdated(list.ownerId, list.lastUpdated),
        O.some,
      ),
    })),
  )),
  T.delay(100),
  T.map(RA.reduce(
    new Map<GroupId, List>(),
    (readModel, list) => readModel.set(list.ownerId, list),
  )),
);
