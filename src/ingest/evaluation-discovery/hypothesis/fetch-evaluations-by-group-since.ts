import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Annotation } from './annotation';
import { discoverHypothesisEvaluations } from './discover-hypothesis-evaluations';
import { FetchData } from '../../fetch-data';

export const fetchEvaluationsByGroupSince = (
  startDate: Date,
  fetchData: FetchData,
) => (groupId: string): TE.TaskEither<string, ReadonlyArray<Annotation>> => pipe(
  discoverHypothesisEvaluations(`group=${groupId}`, startDate, fetchData),
);
