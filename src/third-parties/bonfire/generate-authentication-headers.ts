import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { postDataBonfire } from './post-data-bonfire';
import { Logger } from '../../logger';
import * as DE from '../../types/data-error';

const getUserToken = (logger: Logger) => pipe(
  {
    query: '',
  },
  JSON.stringify,
  postDataBonfire(logger, 'https://discussions.sciety.org/api/graphql'),
  TE.map(() => ''),
);

export const generateAuthenticationHeaders = (
  logger: Logger,
): TE.TaskEither<DE.DataError, Record<string, string>> => pipe(
  getUserToken(logger),
  TE.mapLeft(() => DE.notFound),
  TE.map((token) => ({ Authorization: `Bearer ${token}` })),
);
