import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import axios from 'axios';
import { ExternalQueries } from '../external-queries';
import * as DE from '../../types/data-error';
import { Logger } from '../../shared-ports';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchUserAvatarUrl = (logger: Logger): ExternalQueries['fetchUserAvatarUrl'] => () => pipe(
  TE.tryCatch(
    async () => axios.post(
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
    () => DE.unavailable,
  ),
  () => TE.left(DE.unavailable),
);
