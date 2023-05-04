import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { Doi, fromString as doiFromString } from '../../types/doi';

export type GetOneArticleIdInEvaluatedState = () => O.Option<Doi>;

export const getOneArticleIdInEvaluatedState = (readModel: ReadModel): GetOneArticleIdInEvaluatedState => () => pipe(
  readModel,
  R.filter((item) => item.name === 'evaluated'),
  R.keys,
  RA.head,
  O.chain(doiFromString),
);
