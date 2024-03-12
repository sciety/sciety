import * as TE from 'fp-ts/TaskEither';
import { ExternalQueries } from '../external-queries';
import * as DE from '../../types/data-error';

export const fetchUserAvatarUrl: ExternalQueries['fetchUserAvatarUrl'] = () => TE.left(DE.unavailable);
