import axios, { AxiosResponse } from 'axios';
import { Json } from 'fp-ts/Json';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe, identity } from 'fp-ts/function';
import { DependenciesForViews } from '../../read-side/dependencies-for-views';
import { constructHeadersWithUserAgent } from '../../third-parties/construct-headers-with-user-agent';
import { logResponseTime } from '../../third-parties/log-response-time';
import { DependenciesForCommands } from '../../write-side';

type Dependencies = DependenciesForViews & DependenciesForCommands;

export const postData = (
  url: string,
  dependencies: Dependencies,
) => (
  data: Json,
): TE.TaskEither<void, AxiosResponse> => {
  const startTime = new Date();
  return pipe(
    TE.tryCatch(
      async () => axios.post(url, data, {
        headers: constructHeadersWithUserAgent({
          'Content-Type': 'application/json',
        }),
        timeout: 30 * 1000,
      }),
      identity,
    ),
    T.tap((result) => T.of(logResponseTime(dependencies.logger, startTime, result, url))),
    TE.mapLeft((error) => dependencies.logger('error', 'POST request failed', { error })),
  );
};
