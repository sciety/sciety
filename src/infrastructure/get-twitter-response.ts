import { AxiosError } from 'axios';
import { Json } from 'fp-ts/Json';
import * as TE from 'fp-ts/TaskEither';
import { fetchData } from './fetchers';
import { Logger } from './logger';

export type GetTwitterResponse = (url: string) => TE.TaskEither<AxiosError, Json>;

export const getTwitterResponse = (
  twitterApiBearerToken: string,
  logger: Logger,
): GetTwitterResponse => (url) => (
  TE.tryCatch(
    async () => fetchData(logger)<Json>(url, { Authorization: `Bearer ${twitterApiBearerToken}` })
      .then((response) => response.data),
    (error) => error as AxiosError,
  )
);
