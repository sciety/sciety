import * as TE from 'fp-ts/TaskEither';
import { ExternalQueries } from '../../third-parties';
import * as DE from '../../types/data-error';

export const fetchBonfireDiscussionId: ExternalQueries['fetchBonfireDiscussionId'] = () => TE.left(DE.unavailable);
