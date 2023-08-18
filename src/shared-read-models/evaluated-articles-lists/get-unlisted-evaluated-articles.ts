import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as RM from 'fp-ts/ReadonlyMap';
import { ArticleState, ReadModel } from './handle-event';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const articleIsNotListed = (groups: ReadModel['groups']) => (a: ArticleState) => false;

export const getUnlistedEvaluatedArticles = (readmodel: ReadModel) => (): ReadonlyArray<string> => pipe(
  readmodel.articles,
  RM.filter(articleIsNotListed(readmodel.groups)),
  RM.keys(S.Ord),
);
