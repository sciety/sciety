import * as M from 'fp-ts/Map';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RS from 'fp-ts/ReadonlySet';
import { pipe } from 'fp-ts/function';
import { listCreationData } from './list-creation-data';
import { DomainEvent, GroupEvaluatedArticleEvent } from '../domain-events';
import { GroupId } from '../types/group-id';

const createListFromEvaluationEvents = (
  ownerId: GroupId,
  evaluationEvents: ReadonlyArray<GroupEvaluatedArticleEvent>,
) => ({
  name: 'Evaluated articles',
  articleCount: pipe(
    evaluationEvents,
    RA.map((event) => event.articleId.value),
    (articleIds) => (new Set(articleIds)),
    RS.size,
  ),
  lastUpdated: pipe(
    evaluationEvents,
    RA.last,
    O.map((event) => event.date),
  ),
  ownerId,
  description: pipe(
    Object.values(listCreationData),
    RA.findFirst((list) => list.ownerId === ownerId && list.name === 'Evaluated articles'),
    O.map((list) => list.description),
    O.getOrElse(() => ''),
  ),
});

export type List = {
  name: string,
  description: string,
  articleCount: number,
  lastUpdated: O.Option<Date>,
  ownerId: GroupId,
};

type ReadModel = Map<GroupId, List>;

export const allLists = (
  events: ReadonlyArray<DomainEvent>,
): ReadModel => pipe(
  events,
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

export const selectAllListsOwnedBy = (groupId: GroupId) => (readModel: ReadModel): List => (
  readModel.get(groupId) ?? createListFromEvaluationEvents(groupId, [])
);
