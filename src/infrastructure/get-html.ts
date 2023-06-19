import axios from 'axios';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';

type GetHtml = (url: string) => TE.TaskEither<unknown, string>;

// ts-unused-exports:disable-next-line
export const getHtml: GetHtml = (url) => pipe(
  TE.tryCatch(
    async () => axios.get<string>(url, {
      headers: {
        'User-Agent': 'Sciety (http://sciety.org; mailto:team@sciety.org)',
      },
    }),
    identity,
  ),
  TE.map((response) => response.data),
);
