import { FetchStaticFile } from '../../../../shared-ports';
import { Dependencies as TabsViewModelDependencies } from '../../common-components/tabs-view-model';
import { Queries } from '../../../../read-models';

export type Dependencies = Pick<Queries, 'getGroupBySlug' | 'isFollowing' | 'selectAllListsOwnedBy'>
& TabsViewModelDependencies
& {
  fetchStaticFile: FetchStaticFile,
};
