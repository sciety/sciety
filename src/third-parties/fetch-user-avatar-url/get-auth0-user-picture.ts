import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { URL } from 'url';
import { pipe } from 'fp-ts/function';
import { UserId } from '../../types/user-id';
import * as DE from '../../types/data-error';
import { QueryExternalService } from '../query-external-service';

export const getAuth0UserPicture = (
  queryExternalService: QueryExternalService,
  userId: UserId,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
) => (managementApiToken: string): TE.TaskEither<DE.DataError, URL> => pipe(
  `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`,
  queryExternalService(undefined, {}),
  T.map(() => E.right(new URL('http://example.com'))),
);
