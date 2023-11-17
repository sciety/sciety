import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Annotation } from './annotation.js';
import { processServer } from './process-server.js';
import { FetchData } from '../../fetch-data.js';

export const fetchEvaluationsByGroupSince = (
  startDate: Date,
  fetchData: FetchData,
) => (groupId: string): TE.TaskEither<string, ReadonlyArray<Annotation>> => pipe(
  processServer(`group=${groupId}`, startDate, fetchData),
);
