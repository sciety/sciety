import * as TE from 'fp-ts/TaskEither';
import * as EL from '../types/evaluation-locator.js';
import * as DE from '../types/data-error.js';
import { Evaluation } from '../types/evaluation.js';

export type FetchReview = (id: EL.EvaluationLocator) => TE.TaskEither<DE.DataError, Evaluation>;
