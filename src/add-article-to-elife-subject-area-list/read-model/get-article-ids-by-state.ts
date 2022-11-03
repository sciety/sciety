import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ArticleState, ReadModel } from './handle-event';
import { ArticleIdsByState } from '../read-model-status';

const getArticleIds = (readModel: ReadModel, state: ArticleState): ReadonlyArray<string> => pipe(
  readModel,
  R.filter((item) => item === state),
  R.keys,
);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getArticleIdsByState = (myqueryparameter: string) => (readModel: ReadModel): ArticleIdsByState => ({
  evaluated: getArticleIds(readModel, 'evaluated'),
  listed: getArticleIds(readModel, 'listed'),
  'category-known': getArticleIds(readModel, 'category-known'),
  'evaluated-and-category-known': getArticleIds(readModel, 'evaluated-and-category-known'),
});
