import { FetchStaticFile } from '../../../../shared-ports';
import { Ports as TabsViewModelPorts } from '../../common-components/tabs-view-model';
import { Queries } from '../../../../shared-read-models';

export type Dependencies = Pick<Queries, 'getGroupBySlug' | 'isFollowing' | 'selectAllListsOwnedBy'>
& TabsViewModelPorts
& {
  fetchStaticFile: FetchStaticFile,
};
