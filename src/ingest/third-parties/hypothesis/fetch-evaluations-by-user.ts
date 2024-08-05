import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Annotation } from './annotation';
import { discoverHypothesisEvaluations } from './discover-hypothesis-evaluations';
import { FetchData } from '../../fetch-data';

export const fetchEvaluationsByUserSince = (
  startDate: Date,
  fetchData: FetchData,
) => (userId: string): TE.TaskEither<string, ReadonlyArray<Annotation>> => pipe(
  discoverHypothesisEvaluations(`user=${userId}`, startDate, fetchData),
);
