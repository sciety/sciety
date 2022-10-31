import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import {
  ArticleState, ReadModel,
} from './handle-event';
import { Doi } from '../../types/doi';

export const getAllMissingArticleIds = (readModel: ReadModel): ReadonlyArray<Doi> => pipe(
  readModel,
  R.filter((item) => item === 'evaluated' as ArticleState),
  R.keys,
  RA.map((value) => new Doi(value)),
);
