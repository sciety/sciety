import * as TE from 'fp-ts/TaskEither';
import { Queries } from '../read-models';
import { ExternalQueries } from '../third-parties';
import * as DE from '../types/data-error';
import { Evaluation } from '../types/evaluation';
import { EvaluationLocator } from '../types/evaluation-locator';

type Dependencies = Queries & ExternalQueries;

type FetchEvaluation = (evaluationLocator: EvaluationLocator) => TE.TaskEither<DE.DataError, Evaluation>;

export const fetchEvaluation = (dependencies: Dependencies): FetchEvaluation => dependencies.fetchEvaluation;
