import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { Queries } from '../read-models';
import { ExternalQueries } from '../third-parties';
import * as DE from '../types/data-error';
import { EvaluationLocator } from '../types/evaluation-locator';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

type Dependencies = Queries & ExternalQueries;

type Evaluation = {
  fullText: SanitisedHtmlFragment,
  url: URL,
};

type ConstructEvaluation = (evaluationLocator: EvaluationLocator) => TE.TaskEither<DE.DataError, Evaluation>;

export const constructEvaluation = (
  dependencies: Dependencies,
): ConstructEvaluation => dependencies.fetchEvaluationDigest;
