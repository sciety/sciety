import axios, { AxiosResponse } from 'axios';
import * as TE from 'fp-ts/TaskEither';
import { pipe, identity } from 'fp-ts/function';
import { Logger } from '../../logger';
import { DataError } from '../../types/data-error';
import { constructHeadersWithUserAgent } from '../construct-headers-with-user-agent';

export const postDataBonfire = (
  logger: Logger,
  url: string,
) => (
  data: string,
): TE.TaskEither<DataError, AxiosResponse> => pipe(
  TE.tryCatch(
    async () => axios.post(url, data, {
      headers: constructHeadersWithUserAgent({
        'Content-Type': 'application/json',
      }),
    }),
    identity,
  ),
  TE.mapLeft((error) => logger('error', 'POST request to Bonfire failed', { error })),
  TE.mapLeft(() => 'not-found'),
);
