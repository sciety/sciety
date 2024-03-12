import * as TE from 'fp-ts/TaskEither';
import { ExternalQueries } from '../external-queries';
import * as DE from '../../types/data-error';
import { QueryExternalService } from '../query-external-service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchUserAvatarUrl = (queryExternalService: QueryExternalService): ExternalQueries['fetchUserAvatarUrl'] => () => TE.left(DE.unavailable);
