import axios from 'axios';
import * as TE from 'fp-ts/TaskEither';
import { constant, pipe } from 'fp-ts/function';

type GetHtml = (url: string) => TE.TaskEither<'unavailable', string>;

export const getHtml: GetHtml = (url) => pipe(
  TE.tryCatch(
    async () => axios.get<string>(url),
    constant('unavailable' as const),
  ),
  TE.map((response) => response.data),
);
