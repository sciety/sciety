import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ArticleState, ReadModel } from './handle-event';
import { Doi } from '../../types/doi';

const getArticleIds = (readModel: ReadModel, state: ArticleState): ReadonlyArray<string> => pipe(
  readModel,
  R.filter((item) => item === state),
  R.keys,
);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getOneArticleIdInEvaluatedState = (readModel: ReadModel) => (): O.Option<Doi> => pipe(
  {
    evaluated: getArticleIds(readModel, 'evaluated'),
    listed: getArticleIds(readModel, 'listed'),
    'category-known': getArticleIds(readModel, 'category-known'),
    'evaluated-and-category-known': getArticleIds(readModel, 'evaluated-and-category-known'),
  },
  (articleIdsByState) => articleIdsByState.evaluated,
  RA.head,
  O.map((articleId) => new Doi(articleId)),
);
