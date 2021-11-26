import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RS from 'fp-ts/ReadonlySet';
import { pipe } from 'fp-ts/function';
import { List } from './list';
import { listCreationData } from './list-creation-data';
import { GroupEvaluatedArticleEvent } from '../../domain-events';
import { GroupId } from '../../types/group-id';

export const createListFromEvaluationEvents = (
  ownerId: GroupId,
  evaluationEvents: ReadonlyArray<GroupEvaluatedArticleEvent>,
): List => ({
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
