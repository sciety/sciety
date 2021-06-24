import axios from 'axios';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Logger } from './logger';
import * as DE from '../types/data-error';

type GetHtml = (url: string) => TE.TaskEither<DE.DataError, string>;

export const getHtml = (logger: Logger): GetHtml => (url) => pipe(
  TE.tryCatch(
    async () => axios.get<string>(url),
    (error) => {
      logger('error', 'Failed to get HTML', { url, error });
      return DE.unavailable;
    },
  ),
  TE.map((response) => response.data),
);
