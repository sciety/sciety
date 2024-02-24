import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event.js';
import * as EDOI from '../../types/expression-doi.js';

type GetOneArticleIdInEvaluatedState = () => O.Option<EDOI.ExpressionDoi>;

export const getOneArticleIdInEvaluatedState = (readModel: ReadModel): GetOneArticleIdInEvaluatedState => () => pipe(
  readModel,
  R.filter((item) => item.name === 'evaluated'),
  R.keys,
  RA.head,
  O.map(EDOI.fromValidatedString),
);
