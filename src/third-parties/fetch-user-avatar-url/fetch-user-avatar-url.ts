import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { getAuth0ManagementApiToken } from './get-auth0-management-api-token';
import { getAuth0UserPicture } from './get-auth0-user-picture';
import { Logger } from '../../logger';
import { UserId } from '../../types/user-id';
import { ExternalQueries } from '../external-queries';
import { QueryExternalService } from '../query-external-service';

export const fetchUserAvatarUrl = (queryExternalService: QueryExternalService, logger: Logger): ExternalQueries['fetchUserAvatarUrl'] => (userId: UserId) => pipe(
  getAuth0ManagementApiToken(logger),
  TE.chain(getAuth0UserPicture(queryExternalService, logger, userId)),
);
