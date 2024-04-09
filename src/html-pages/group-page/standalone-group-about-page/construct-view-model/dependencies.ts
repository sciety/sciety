import { Dependencies as TabsViewModelDependencies } from '../../common-components/tabs-view-model';
import { Queries } from '../../../../read-models';
import { ExternalQueries } from '../../../../third-parties';

export type Dependencies = Pick<Queries, 'getGroupBySlug' | 'isFollowing' | 'selectAllListsOwnedBy'>
& ExternalQueries
& TabsViewModelDependencies;
