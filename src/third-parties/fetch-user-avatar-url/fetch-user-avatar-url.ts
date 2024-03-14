import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { ExternalQueries } from '../external-queries';
import * as DE from '../../types/data-error';
import { Logger } from '../../shared-ports';
import { getAuth0ManagementApiToken } from './get-auth0-management-api-token';

export const fetchUserAvatarUrl = (logger: Logger): ExternalQueries['fetchUserAvatarUrl'] => () => pipe(
  getAuth0ManagementApiToken(logger),
  T.map(() => E.left(DE.unavailable)),
);
