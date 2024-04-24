import { Queries } from '../../../../../read-models';
import { ExternalQueries } from '../../../../../third-parties';

export type Dependencies = Pick<Queries, 'getGroupBySlug' | 'isFollowing' | 'selectAllListsOwnedBy'>
& ExternalQueries;
