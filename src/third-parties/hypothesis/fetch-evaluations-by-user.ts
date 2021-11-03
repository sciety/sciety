import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Annotation } from './annotation';
import { processServer } from './process-server';
import { FetchData } from '../../ingest/fetch-data';

export const fetchEvaluationsByUserSince = (
  startDate: Date,
  fetchData: FetchData,
) => (userId: string): TE.TaskEither<string, ReadonlyArray<Annotation>> => pipe(
  ['biorxiv', 'medrxiv'],
  TE.traverseArray(processServer(`user=${userId}`, startDate, fetchData)),
  TE.map(RA.flatten),
);
