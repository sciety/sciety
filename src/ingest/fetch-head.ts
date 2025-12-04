import { performance } from 'perf_hooks';
import axios from 'axios';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Configuration } from './generate-configuration-from-environment';
import { report } from './report';

const axiosHead = async (ingestDebug: Configuration['ingestDebug'], url: string, additionalHeaders: Record<string, string>) => {
  const startTime = performance.now();
  const headers = {
    'User-Agent': 'Sciety (http://sciety.org; mailto:team@sciety.org)',
    ...additionalHeaders,
  };
  return axios.head(url, { headers }).finally(() => {
    if (ingestDebug) {
      const endTime = performance.now();
      report('debug', 'Fetched URL for ingestion')({
        url,
        durationMs: Math.round(endTime - startTime),
      });
    }
  });
};

export type FetchHead = (url: string, headers?: Record<string, string>)
=> TE.TaskEither<string, Record<string, unknown>>;

export const fetchHead = (
  environment: Configuration,
): FetchHead => (
  url: string,
  headers = {},
): TE.TaskEither<string, Record<string, unknown>> => pipe(
  TE.tryCatch(
    async () => axiosHead(environment.ingestDebug, url, headers),
    String,
  ),
  TE.map((response) => response.headers),
);
