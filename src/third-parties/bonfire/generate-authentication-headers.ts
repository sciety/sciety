import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../../types/data-error';

const getUserToken = () => TE.right('');

export const generateAuthenticationHeaders = (): TE.TaskEither<DE.DataError, Record<string, string>> => pipe(
  getUserToken(),
  TE.mapLeft(() => DE.notFound),
  TE.map((token) => ({ Authorization: `Bearer ${token}` })),
);
