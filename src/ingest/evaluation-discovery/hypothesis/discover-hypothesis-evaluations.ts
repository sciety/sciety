import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Annotation } from './annotation';
import { hypothesisResponseCodec } from './response';
import { FetchData } from '../../fetch-data';
import { decodeAndReportFailures } from '../decode-and-report-failures';

const latestDateOf = (items: ReadonlyArray<Annotation>) => (
  encodeURIComponent(items[items.length - 1].created)
);

const fetchPaginatedData = (
  fetchData: FetchData,
  baseUrl: string,
  offset: string,
  pageNumber: number,
): TE.TaskEither<string, ReadonlyArray<Annotation>> => pipe(
  fetchData<unknown>(`${baseUrl}${offset}`),
  TE.chainEitherK(decodeAndReportFailures(hypothesisResponseCodec)),
  TE.map((response) => response.rows),
  TE.flatMap(RA.match(
    () => TE.right([]),
    (items) => pipe(
      T.of(''),
      T.delay(50 * pageNumber),
      TE.rightTask,
      TE.flatMap(() => fetchPaginatedData(fetchData, baseUrl, latestDateOf(items), pageNumber + 1)),
      TE.map((next) => [...items, ...next]),
    ),
  )),
);

export const discoverHypothesisEvaluations = (
  owner: string,
  startDate: Date,
  fetchData: FetchData,
): TE.TaskEither<string, ReadonlyArray<Annotation>> => {
  const latestDate = encodeURIComponent(startDate.toISOString());
  const baseUrl = `https://api.hypothes.is/api/search?${owner}&limit=200&sort=created&order=asc&search_after=`;
  return fetchPaginatedData(fetchData, baseUrl, latestDate, 0);
};
