import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event.js';
import { RecordedEvaluation } from '../../types/recorded-evaluation.js';

type GetEvaluationsWithNoType = () => ReadonlyArray<RecordedEvaluation>;

export const getEvaluationsWithNoType = (readmodel: ReadModel): GetEvaluationsWithNoType => () => pipe(
  Object.fromEntries(readmodel.byExpressionDoi),
  Object.values,
  (values) => values as ReadonlyArray<ReadonlyArray<RecordedEvaluation>>,
  RA.flatten,
  RA.filter((evaluation) => O.isNone(evaluation.type)),
);
