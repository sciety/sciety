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
    participants: evaluation.authors,
    evaluationLocator: evaluation.evaluationLocator,
    publishedAt: evaluation.publishedAt,
    recordedAt: evaluation.recordedAt,
    webPageOriginalUrl: url,
    updatedAt: evaluation.updatedAt,
    webContentUrl: constructEvaluationContentUrl(evaluation.evaluationLocator),
  })),
);
