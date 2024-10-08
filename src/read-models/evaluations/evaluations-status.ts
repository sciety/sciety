import * as D from 'fp-ts/Date';
import { Json } from 'fp-ts/Json';
import * as O from 'fp-ts/Option';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { RecordedEvaluation } from './recorded-evaluation';
import { evaluationTypes } from '../../domain-events/types/evaluation-type';

const byDate: Ord.Ord<RecordedEvaluation> = pipe(
  D.Ord,
  Ord.contramap((evaluation) => evaluation.publishedAt),
);

type CountOccurrencesOfEvaluationTypes = (soughtType: string, evaluationTypes: ReadonlyArray<RecordedEvaluation['type']>) => number;

const countOccurrencesOfEvaluationTypes: CountOccurrencesOfEvaluationTypes = (
  soughtType,
  recordedEvaluationTypes,
) => pipe(
  recordedEvaluationTypes,
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
    [evaluationTypes.curationStatement]: countOccurrencesOfEvaluationTypes(
      evaluationTypes.curationStatement, partitioned.right,
    ),
    [evaluationTypes.review]: countOccurrencesOfEvaluationTypes(
      evaluationTypes.review, partitioned.right,
    ),
    [evaluationTypes.authorResponse]: countOccurrencesOfEvaluationTypes(
      evaluationTypes.authorResponse, partitioned.right,
    ),
    [evaluationTypes.notProvided]: countOccurrencesOfEvaluationTypes(
      evaluationTypes.notProvided, partitioned.right,
    ),
    unknown: partitioned.left.length,
  }),
);
