import * as TE from 'fp-ts/TaskEither';
import * as RI from '../types/review-id';
import * as DE from '../types/data-error';
import { Evaluation } from '../infrastructure/evaluation';

export type FetchReview = (id: RI.ReviewId) => TE.TaskEither<DE.DataError, Evaluation>;
