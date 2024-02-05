import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as Eq from 'fp-ts/Eq';
import * as S from 'fp-ts/string';
import { ReadModel } from './handle-event';
import { RecordedEvaluation } from '../../types/recorded-evaluation';
import { ExpressionDoi } from '../../types/expression-doi';

const eqEntry: Eq.Eq<RecordedEvaluation> = Eq.struct({
  evaluationLocator: S.Eq,
});

type GetEvaluationsOfMultipleExpressions = (
  expressionDois: ReadonlyArray<ExpressionDoi>
) => ReadonlyArray<RecordedEvaluation>;

export const getEvaluationsOfMultipleExpressions = (
  readmodel: ReadModel,
): GetEvaluationsOfMultipleExpressions => (expressionDois) => pipe(
  expressionDois,
  RA.flatMap((expressionDoi) => readmodel.byExpressionDoi.get(expressionDoi) ?? []),
  RA.uniq(eqEntry),
);
