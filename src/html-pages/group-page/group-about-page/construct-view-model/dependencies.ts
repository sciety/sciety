import { FetchStaticFile } from '../../../../shared-ports/index.js';
import { Dependencies as TabsViewModelDependencies } from '../../common-components/tabs-view-model.js';
import { Queries } from '../../../../read-models/index.js';

export type Dependencies = Pick<Queries, 'getGroupBySlug' | 'isFollowing' | 'selectAllListsOwnedBy'>
& TabsViewModelDependencies
& {
  fetchStaticFile: FetchStaticFile,
};
