import { performance } from 'perf_hooks';
import axios from 'axios';
import chalk from 'chalk';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

const axiosGet = async (url: string) => {
  const startTime = performance.now();
  return axios.get<string>(url).finally(() => {
    if (process.env.INGEST_LOG === 'io') {
      const endTime = performance.now();
      process.stdout.write(chalk.yellow(`Fetched ${url} (${Math.round(endTime - startTime)}ms)\n`));
    }
  });
};

export const fetchPage = (url: string): TE.TaskEither<string, string> => pipe(
  TE.tryCatch(
    async () => axiosGet(url),
    E.toError,
  ),
  TE.bimap(
    (error) => error.toString(),
    (response) => response.data,
  ),
);
