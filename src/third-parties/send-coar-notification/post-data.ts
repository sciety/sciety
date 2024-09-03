import axios, { AxiosResponse } from 'axios';
import { Json } from 'fp-ts/Json';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe, identity } from 'fp-ts/function';
import { Logger } from '../../logger';
import { ErrorMessage, toErrorMessage } from '../../types/error-message';
import { constructHeadersWithUserAgent } from '../construct-headers-with-user-agent';
import { logResponseTime } from '../log-response-time';

export const postData = (
  logger: Logger,
  url: string,
) => (
  data: Json,
): TE.TaskEither<ErrorMessage, AxiosResponse> => {
  const startTime = new Date();
  logger('info', 'Preparing to POST', { data });
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
    T.tap((result) => T.of(logResponseTime(logger, startTime, result, url))),
    TE.tapError((error) => TE.right(logger('error', 'POST request failed', { error }))),
    TE.mapLeft(() => toErrorMessage('POST request failed')),
  );
};
