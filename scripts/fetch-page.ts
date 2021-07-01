import axios from 'axios';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

export const fetchPage = (url: string): TE.TaskEither<string, string> => pipe(
  TE.tryCatch(
    async () => axios.get<string>(url),
    E.toError,
  ),
  TE.bimap(
    (error) => error.toString(),
    (response) => response.data,
  ),
);
