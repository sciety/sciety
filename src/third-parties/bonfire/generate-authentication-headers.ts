import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { postDataBonfire } from './post-data-bonfire';
import { Logger } from '../../logger';
import * as DE from '../../types/data-error';
import { decodeAndLogFailures } from '../decode-and-log-failures';

const bonfireAuthenticationTokenCodec = t.type({
  data: t.strict({
    login: t.strict({
      token: t.string,
    }),
  }),
});

const getUserToken = (logger: Logger) => pipe(
  {
    query: `mutation { login (emailOrUsername: "${process.env.BONFIRE_SCIETY_ACCOUNT_EMAIL}" password: "${process.env.BONFIRE_SCIETY_ACCOUNT_PASSWORD}") { token } }`,
  },
  JSON.stringify,
  postDataBonfire(logger, 'https://discussions.sciety.org/api/graphql'),
  TE.chainEitherKW(flow(
    decodeAndLogFailures(logger, bonfireAuthenticationTokenCodec),
    E.mapLeft(() => DE.unavailable),
  )),
  TE.map((decodedResponse) => decodedResponse.data.login.token),
);

export const generateAuthenticationHeaders = (
  logger: Logger,
): TE.TaskEither<DE.DataError, Record<string, string>> => pipe(
  getUserToken(logger),
  TE.mapLeft(() => DE.notFound),
  TE.map((token) => ({ Authorization: `Bearer ${token}` })),
);
