import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Action } from './action';
import { Dependencies } from './dependencies';
import * as DE from '../../../../types/data-error';
import * as EL from '../../../../types/evaluation-locator';
import { RecordedEvaluation } from '../../../../types/recorded-evaluation';

export const constructAction = (
  dependencies: Dependencies,
) => (
  evaluation: RecordedEvaluation,
): TE.TaskEither<DE.DataError, Action> => pipe(
  evaluation.evaluationLocator,
  dependencies.fetchEvaluationHumanReadableOriginalUrl,
  TE.map((url) => ({
    ...evaluation,
    sourceUrl: url,
    webContentUrl: new URL(`https://sciety.org/evaluations/${EL.serialize(evaluation.evaluationLocator)}/content`),
  })),
);
