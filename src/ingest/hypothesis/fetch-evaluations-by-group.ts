import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Annotation } from './annotation';
import { processServer } from './process-server';
import { FetchData } from '../fetch-data';

export const fetchEvaluationsByGroupSince = (
  startDate: Date,
  fetchData: FetchData,
) => (groupId: string): TE.TaskEither<string, ReadonlyArray<Annotation>> => pipe(
  ['biorxiv', 'medrxiv'],
  TE.traverseArray(processServer(`group=${groupId}`, startDate, fetchData)),
  TE.map(RA.flatten),
);
