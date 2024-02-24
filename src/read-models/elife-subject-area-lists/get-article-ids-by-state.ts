import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ArticleStateName, ReadModel } from './handle-event.js';

type ArticleIdsByState = Record<string, ReadonlyArray<string>>;

type GetArticleIdsByState = () => ArticleIdsByState;

const getArticleIds = (readModel: ReadModel,
  selectedState: ArticleStateName): ReadonlyArray<string> => pipe(
  readModel,
  R.filter((item) => item.name === selectedState),
  R.keys,
);

export const getArticleIdsByState = (readModel: ReadModel): GetArticleIdsByState => () => ({
  evaluated: getArticleIds(readModel, 'evaluated'),
  listed: getArticleIds(readModel, 'listed'),
  'subject-area-known': getArticleIds(readModel, 'subject-area-known'),
  'evaluated-and-subject-area-known': getArticleIds(readModel, 'evaluated-and-subject-area-known'),
});
