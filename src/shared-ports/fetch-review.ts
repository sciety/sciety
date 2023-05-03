import * as TE from 'fp-ts/TaskEither';
import * as RI from '../types/evaluation-locator';
import * as DE from '../types/data-error';
import { Evaluation } from '../types/evaluation';

export type FetchReview = (id: RI.EvaluationLocator) => TE.TaskEither<DE.DataError, Evaluation>;
