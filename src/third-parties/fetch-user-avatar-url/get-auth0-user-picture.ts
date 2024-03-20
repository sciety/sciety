import * as TE from 'fp-ts/TaskEither';
import { URL } from 'url';
import { UserId } from '../../types/user-id';
import * as DE from '../../types/data-error';

export const getAuth0UserPicture = (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  userId: UserId,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
) => (managementApiToken: string): TE.TaskEither<DE.DataError, URL> => TE.right(new URL('http://example.com'));
