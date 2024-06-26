import * as D from 'fp-ts/Date';
import { Json } from 'fp-ts/Json';
import * as O from 'fp-ts/Option';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { RecordedEvaluation } from '../../types/recorded-evaluation';

const byDate: Ord.Ord<RecordedEvaluation> = pipe(
  D.Ord,
  Ord.contramap((evaluation) => evaluation.publishedAt),
);

type FindEvaluationsOfType = (soughtType: string, evaluationTypes: ReadonlyArray<RecordedEvaluation['type']>) => number;

const findEvaluationsOfType: FindEvaluationsOfType = (soughtType, evaluationTypes) => pipe(
  evaluationTypes,
  O.sequenceArray,
  O.match(
    () => 0,
    (evaluationType) => pipe(
      evaluationType,
      RA.filter((t) => t === soughtType),
      (found) => found.length,
    ),
  ),
);

export const evaluationsStatus = (readmodel: ReadModel) => (): Json => pipe(
  readmodel.byExpressionDoi,
  RM.values(RA.getOrd(byDate)),
  RA.flatten,
  RA.map((evaluation) => evaluation.type),
  RA.partition((t) => O.isSome(t)),
  (partitioned) => ({
    'curation-statement': findEvaluationsOfType('curation-statement', partitioned.right),
    review: findEvaluationsOfType('review', partitioned.right),
    'author-response': findEvaluationsOfType('author-response', partitioned.right),
    'not-provided': findEvaluationsOfType('not-provided', partitioned.right),
    unknown: partitioned.left.length,
  }),
);
