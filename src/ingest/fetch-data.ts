import { performance } from 'perf_hooks';
import axios from 'axios';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Configuration } from './generate-configuration-from-environment';
import { report } from './report';

const axiosGet = async <D>(ingestDebug: Configuration['ingestDebug'], url: string, additionalHeaders: Record<string, string>) => {
  const startTime = performance.now();
  const headers = {
    'User-Agent': 'Sciety (http://sciety.org; mailto:team@sciety.org)',
    ...additionalHeaders,
  };
  return axios.get<D>(url, { headers }).finally(() => {
    if (ingestDebug) {
      const endTime = performance.now();
      report('debug', 'Fetched URL for ingestion')({
        url,
        durationMs: Math.round(endTime - startTime),
      });
    }
  });
};

export type FetchData = <D>(url: string, headers?: Record<string, string>) => TE.TaskEither<string, D>;

export const fetchData = (
  environment: Configuration,
): FetchData => <D>(
  url: string,
  headers = {},
): TE.TaskEither<string, D> => pipe(
    TE.tryCatch(
      async () => axiosGet<D>(environment.ingestDebug, url, headers),
      String,
    ),
    TE.map((response) => response.data),
  );
