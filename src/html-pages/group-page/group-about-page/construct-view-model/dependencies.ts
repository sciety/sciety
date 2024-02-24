import { Dependencies as TabsViewModelDependencies } from '../../common-components/tabs-view-model.js';
import { Queries } from '../../../../read-models/index.js';
import { ExternalQueries } from '../../../../third-parties/index.js';

export type Dependencies = Pick<Queries, 'getGroupBySlug' | 'isFollowing' | 'selectAllListsOwnedBy'>
& ExternalQueries
& TabsViewModelDependencies;
