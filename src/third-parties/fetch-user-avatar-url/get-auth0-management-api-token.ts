import axios from 'axios';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import { Logger } from '../../logger';
import * as DE from '../../types/data-error';

const managementApiTokenCodec = t.type({
  access_token: t.string,
  scope: t.literal('read:users'),
  token_type: t.literal('Bearer'),
});

export const getAuth0ManagementApiToken = (logger: Logger): TE.TaskEither<DE.DataError, string> => pipe(
  TE.tryCatch(
    async () => axios.post<unknown>(
      `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      JSON.stringify({
        grant_type: 'client_credentials',
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ),
    (error) => {
      if (axios.isAxiosError(error)) {
        logger('error', 'Failed to get Management API token from Auth0', { error: String(error.response) });
      } else {
        logger('error', 'Failed to get Management API token from Auth0', { error: String(error) });
      }
      return DE.unavailable;
    },
  ),
  TE.map((axiosResponse) => axiosResponse.data),
  TE.chainEitherK(flow(
    managementApiTokenCodec.decode,
    E.mapLeft(
      (errors) => {
        logger('error', 'Unreadable response from Auth0', { errors: formatValidationErrors(errors) });
        return DE.unavailable;
      },
    ),
  )),
  TE.map((response) => {
    logger('verbose', 'Auth0 Management API token obtained successfully', { truncatedAccessToken: `${response.access_token.substring(0, 5)}...` });
    return response;
  }),
  TE.map((response) => response.access_token),
);
