import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as PR from 'io-ts/PathReporter';
import { Annotation } from './annotation';
import { responseFromJson } from './response';
import { FetchData } from '../fetch-data';

const latestDateOf = (items: ReadonlyArray<Annotation>) => (
  encodeURIComponent(items[items.length - 1].created)
);

const fetchPaginatedData = (
  fetchData: FetchData,
  baseUrl: string,
  offset: string,
): TE.TaskEither<string, ReadonlyArray<Annotation>> => pipe(
  fetchData<unknown>(`${baseUrl}${offset}`),
  TE.chainEitherK(flow(
    responseFromJson.decode,
    E.mapLeft((error) => PR.failure(error).join('\n')),
  )),
  TE.map((response) => response.rows),
  TE.chain(RA.match(
    () => TE.right([]),
    (items) => pipe(
      fetchPaginatedData(fetchData, baseUrl, latestDateOf(items)),
      TE.map((next) => [...items, ...next]),
    ),
  )),
);

export const processServer = (
  owner: string,
  startDate: Date,
  fetchData: FetchData,
) => (server: string): TE.TaskEither<string, ReadonlyArray<Annotation>> => {
  const latestDate = encodeURIComponent(startDate.toISOString());
  const baseUrl = `https://api.hypothes.is/api/search?${owner}&uri.parts=${server}&limit=200&sort=created&order=asc&search_after=`;
  return fetchPaginatedData(fetchData, baseUrl, latestDate);
};
