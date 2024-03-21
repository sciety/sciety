import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { QueryExternalService } from '../query-external-service';
import { ExternalQueries } from '../external-queries';
import * as DE from '../../types/data-error';
import { Logger } from '../../infrastructure-contract';
import { getAuth0ManagementApiToken } from './get-auth0-management-api-token';
import { UserId } from '../../types/user-id';
import { getAuth0UserPicture } from './get-auth0-user-picture';

export const fetchUserAvatarUrl = (queryExternalService: QueryExternalService, logger: Logger): ExternalQueries['fetchUserAvatarUrl'] => (userId: UserId) => pipe(
  getAuth0ManagementApiToken(logger),
  TE.chain(getAuth0UserPicture(queryExternalService, logger, userId)),
  T.map(() => E.left(DE.unavailable)),
);
