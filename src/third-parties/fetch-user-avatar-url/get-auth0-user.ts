import * as TE from 'fp-ts/TaskEither';
import { UserId } from '../../types/user-id';
import * as DE from '../../types/data-error';

export const getAuth0User = (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  userId: UserId,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
) => (managementApiToken: string): TE.TaskEither<DE.DataError, object> => TE.right({});
