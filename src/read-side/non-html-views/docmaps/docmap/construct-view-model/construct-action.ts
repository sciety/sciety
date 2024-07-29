import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../../../../../types/data-error';
import * as EL from '../../../../../types/evaluation-locator';
import { RecordedEvaluation } from '../../../../../types/recorded-evaluation';
import { DependenciesForViews } from '../../../../dependencies-for-views';
import { Action } from '../action';

const appOrigin = 'https://sciety.org';

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
    webContentUrl: new URL(`${appOrigin}/evaluations/${EL.serialize(evaluation.evaluationLocator)}/content`),
  })),
);
