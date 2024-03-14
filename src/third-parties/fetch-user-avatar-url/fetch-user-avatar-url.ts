import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import axios from 'axios';
import { formatValidationErrors } from 'io-ts-reporters';
import { ExternalQueries } from '../external-queries';
import * as DE from '../../types/data-error';
import { Logger } from '../../shared-ports';

const managementApiTokenCodec = t.type({
  access_token: t.string,
  scope: t.literal('read:users'),
  token_type: t.literal('Bearer'),
});

export const fetchUserAvatarUrl = (logger: Logger): ExternalQueries['fetchUserAvatarUrl'] => () => pipe(
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
    E.bimap(
      (errors) => {
        logger('error', 'Unreadable response from Auth0', { errors: formatValidationErrors(errors) });
        return DE.unavailable;
      },
      (response) => response.access_token,
    ),
  )),
  T.map(() => E.left(DE.unavailable)),
);
