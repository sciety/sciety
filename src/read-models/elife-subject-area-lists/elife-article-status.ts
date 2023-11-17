import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { Json } from 'fp-ts/Json';
import { ArticleStateName, ReadModel } from './handle-event.js';

const getArticleIds = (readModel: ReadModel,
  selectedState: ArticleStateName): ReadonlyArray<string> => pipe(
  readModel,
  R.filter((item) => item.name === selectedState),
  R.keys,
);

export const elifeArticleStatus = (readModel: ReadModel) => (): Json => ({
  evaluated: getArticleIds(readModel, 'evaluated'),
  'subject-area-known': getArticleIds(readModel, 'subject-area-known'),
  'evaluated-and-subject-area-known': getArticleIds(readModel, 'evaluated-and-subject-area-known'),
  listed: getArticleIds(readModel, 'listed').length,
});
