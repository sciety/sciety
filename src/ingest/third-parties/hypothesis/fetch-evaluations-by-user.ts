import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Annotation } from './annotation.js';
import { processServer } from './process-server.js';
import { FetchData } from '../../fetch-data.js';

export const fetchEvaluationsByUserSince = (
  startDate: Date,
  fetchData: FetchData,
) => (userId: string): TE.TaskEither<string, ReadonlyArray<Annotation>> => pipe(
  processServer(`user=${userId}`, startDate, fetchData),
);
