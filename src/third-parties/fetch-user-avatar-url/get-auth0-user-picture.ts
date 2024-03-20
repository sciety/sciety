import * as TE from 'fp-ts/TaskEither';
import { URL } from 'url';
import { pipe } from 'fp-ts/function';
import { UserId } from '../../types/user-id';
import * as DE from '../../types/data-error';

export const getAuth0UserPicture = (
  userId: UserId,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
) => (managementApiToken: string): TE.TaskEither<DE.DataError, URL> => pipe(
  `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`,
  () => TE.right(new URL('http://example.com')),
);
