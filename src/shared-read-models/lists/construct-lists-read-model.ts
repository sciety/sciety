import * as M from 'fp-ts/Map';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RS from 'fp-ts/ReadonlySet';
import { pipe } from 'fp-ts/function';
import { createListFromEvaluationEvents } from './create-list-from-evaluation-events';
import { List } from './list';
import { DomainEvent, GroupEvaluatedArticleEvent } from '../../domain-events';
import { ListCreatedEvent } from '../../domain-events/list-created-event';
import { GroupId } from '../../types/group-id';

type ReadModel = Map<GroupId, List>;

const calculateArticleCount = (ownerId: GroupId) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter((event): event is GroupEvaluatedArticleEvent => event.type === 'GroupEvaluatedArticle'),
  RA.filter((event) => event.groupId === ownerId),
  RA.map((event) => event.articleId.value),
  (articleIds) => (new Set(articleIds)),
  RS.size,
);

const calculateLastUpdated = (ownerId: GroupId) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter((event): event is GroupEvaluatedArticleEvent => event.type === 'GroupEvaluatedArticle'),
  RA.filter((event) => event.groupId === ownerId),
  RA.last,
  O.map((event) => event.date),
);

export const constructListsReadModel = (
  events: ReadonlyArray<DomainEvent>,
): ReadModel => pipe(
  events,
  RA.filter((event): event is ListCreatedEvent => event.type === 'ListCreated'),
  RA.map((event): List => ({
    ...event,
    articleCount: 0,
    lastUpdated: O.some(event.date),
  })),
  RA.map((list) => ({
    ...list,
    articleCount: pipe(events, calculateArticleCount(list.ownerId)),
    lastUpdated: pipe(events, calculateLastUpdated(list.ownerId)),
  })),
  () => events,
  RA.filter((event): event is GroupEvaluatedArticleEvent => event.type === 'GroupEvaluatedArticle'),
  RA.reduce(
    new Map<GroupId, Array<GroupEvaluatedArticleEvent>>(),
    (accumulator, event) => {
      if (accumulator.has(event.groupId)) {
        accumulator.get(event.groupId)?.push(event);
      } else {
        accumulator.set(event.groupId, [event]);
      }
      return accumulator;
    },
  ),
  M.mapWithIndex(createListFromEvaluationEvents),
);
