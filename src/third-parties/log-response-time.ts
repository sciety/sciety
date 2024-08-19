import { AxiosResponse } from 'axios';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { Logger } from '../logger';

export const logResponseTime = (
  logger: Logger,
  startTime: Date,
  result: E.Either<unknown, AxiosResponse>,
  url: string,
): void => {
  const durationInMs = new Date().getTime() - startTime.getTime();
  const responseStatus = pipe(
    result,
    E.map((response) => response.status),
    E.getOrElseW(() => 'not-available-because-request-failed'),
  );
  logger('debug', 'Response time', { url, durationInMs, responseStatus });
};
