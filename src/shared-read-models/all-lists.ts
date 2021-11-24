import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RS from 'fp-ts/ReadonlySet';
import * as R from 'fp-ts/Record';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { listCreationData } from './list-creation-data';
import { DomainEvent, GroupEvaluatedArticleEvent } from '../domain-events';
import * as DE from '../types/data-error';
import { GroupId } from '../types/group-id';

const createListFromEvaluationEvents = (
  ownerId: GroupId,
) => (
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

export const allLists = (
  groupId: GroupId,
) => (
  events: ReadonlyArray<DomainEvent>,
): TE.TaskEither<DE.DataError, List> => pipe(
  events,
  RA.filter((event): event is GroupEvaluatedArticleEvent => event.type === 'GroupEvaluatedArticle'),
  RA.reduce(
    {} as Record<string, Array<GroupEvaluatedArticleEvent>>,
    (accumulator, event) => {
      if (accumulator[event.groupId]) {
        accumulator[event.groupId].push(event);
      } else {
        accumulator[event.groupId] = [event];
      }
      return accumulator;
    },
  ),
  R.map(createListFromEvaluationEvents(groupId)),
  (readModel) => readModel[groupId] ?? createListFromEvaluationEvents(groupId)([]),
  TE.right,
);
