import { Ports as AugmentWithUserDetailsPorts } from './augment-with-user-details';
import { Ports as FindFollowersPorts } from './find-followers';
import { Dependencies as TabsViewModelPorts } from '../../common-components/tabs-view-model';
import { Queries } from '../../../../shared-read-models';

export type Dependencies = Pick<Queries, 'getGroupBySlug' | 'isFollowing'>
& FindFollowersPorts
& AugmentWithUserDetailsPorts
& TabsViewModelPorts;
