import * as TE from 'fp-ts/TaskEither';
import * as EL from '../types/evaluation-locator';
import * as DE from '../types/data-error';
import { Evaluation } from '../types/evaluation';

export type FetchReview = (id: EL.EvaluationLocator) => TE.TaskEither<DE.DataError, Evaluation>;
