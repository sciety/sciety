import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as S from 'fp-ts/string';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import { ArticleState, ReadModel } from './handle-event';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const articleIsNotListed = (groups: ReadModel['groups']) => (a: ArticleState): boolean => pipe(
  a.evaluatedBy,
  RA.filter((groupId) => groups.has(groupId)),
  RA.map((groupId) => groups.get(groupId)),
  RA.map(O.fromNullable),
  RA.compact,
  RA.filter((listId) => !a.listedIn.includes(listId)),
  RA.isEmpty,
);

export const getUnlistedEvaluatedArticles = (readmodel: ReadModel) => (): ReadonlyArray<string> => pipe(
  readmodel.articles,
  RM.filter(articleIsNotListed(readmodel.groups)),
  RM.keys(S.Ord),
);
