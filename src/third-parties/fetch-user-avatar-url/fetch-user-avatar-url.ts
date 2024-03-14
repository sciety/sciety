import * as TE from 'fp-ts/TaskEither';
import { ExternalQueries } from '../external-queries';
import * as DE from '../../types/data-error';
import { Logger } from '../../shared-ports';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchUserAvatarUrl = (logger: Logger): ExternalQueries['fetchUserAvatarUrl'] => () => TE.left(DE.unavailable);
