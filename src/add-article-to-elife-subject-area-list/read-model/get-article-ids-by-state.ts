import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ArticleStateName, ReadModel } from './handle-event';
import { ArticleIdsByState } from '../read-model-status';

const getArticleIds = (readModel: ReadModel,
  selectedState: ArticleStateName): ReadonlyArray<string> => pipe(
  readModel,
  R.filter((item) => item.name === selectedState),
  R.keys,
);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getArticleIdsByState = (readModel: ReadModel) => (): ArticleIdsByState => ({
  evaluated: getArticleIds(readModel, 'evaluated'),
  listed: getArticleIds(readModel, 'listed'),
  'subject-area-known': getArticleIds(readModel, 'subject-area-known'),
  'evaluated-and-subject-area-known': getArticleIds(readModel, 'evaluated-and-subject-area-known'),
});
