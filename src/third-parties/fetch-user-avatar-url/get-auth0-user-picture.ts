import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Logger } from '../../shared-ports';
import * as DE from '../../types/data-error';
import { UserId } from '../../types/user-id';
import { decodeAndLogFailures } from '../decode-and-log-failures';
import { QueryExternalService } from '../query-external-service';

const auth0UserCodec = t.strict({
  picture: t.string,
}, 'auth0UserCodec');

export const getAuth0UserPicture = (
  queryExternalService: QueryExternalService,
  logger: Logger,
  userId: UserId,
) => (managementApiToken: string): TE.TaskEither<DE.DataError, string> => pipe(
  `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`,
  queryExternalService(undefined, { Authorization: `Bearer ${managementApiToken}` }),
  TE.chainEitherKW(flow(
    decodeAndLogFailures(logger, auth0UserCodec, { userId }),
    E.mapLeft(() => DE.unavailable),
  )),
  TE.map((auth0User) => auth0User.picture),
);
