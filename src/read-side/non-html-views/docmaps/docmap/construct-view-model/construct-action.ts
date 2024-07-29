import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../../../../../types/data-error';
import { RecordedEvaluation } from '../../../../../types/recorded-evaluation';
import { constructEvaluationContentUrl } from '../../../../construct-evaluation-content-url';
import { DependenciesForViews } from '../../../../dependencies-for-views';
import { Action } from '../action';

export const constructAction = (
  dependencies: DependenciesForViews,
) => (
  evaluation: RecordedEvaluation,
): TE.TaskEither<DE.DataError, Action> => pipe(
  evaluation.evaluationLocator,
  dependencies.fetchEvaluationHumanReadableOriginalUrl,
  TE.map((url) => ({
    ...evaluation,
    sourceUrl: url,
    webContentUrl: constructEvaluationContentUrl(evaluation.evaluationLocator),
  })),
);
