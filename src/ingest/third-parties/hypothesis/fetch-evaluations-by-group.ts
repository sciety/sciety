import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Annotation } from './annotation';
import { processServer } from './process-server';
import { FetchData } from '../../ingest/fetch-data';

export const fetchEvaluationsByGroupSince = (
  startDate: Date,
  fetchData: FetchData,
) => (groupId: string): TE.TaskEither<string, ReadonlyArray<Annotation>> => pipe(
  processServer(`group=${groupId}`, startDate, fetchData),
);
