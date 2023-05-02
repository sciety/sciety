import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { paginationControls } from '../../../../shared-components/pagination-controls';
import { paginate } from './paginate';
import { augmentWithUserDetails, Ports as AugmentWithUserDetailsPorts } from './augment-with-user-details';
import { IsFollowing } from '../../../../shared-ports';
import { userIdCodec } from '../../../../types/user-id';
import * as DE from '../../../../types/data-error';
import { ViewModel } from '../view-model';
import { findFollowers, Ports as FindFollowersPorts } from './find-followers';
import { constructTabsViewModel, Ports as TabsViewModelPorts } from '../../common-components/tabs-view-model';
import { GroupId } from '../../../../types/group-id';
import { Queries } from '../../../../shared-read-models';

export type Ports = FindFollowersPorts & AugmentWithUserDetailsPorts & TabsViewModelPorts & {
  getGroupBySlug: Queries['getGroupBySlug'],
  isFollowing: IsFollowing,
};

export const paramsCodec = t.type({
  slug: t.string,
  user: tt.optionFromNullable(t.type({
    id: userIdCodec,
  })),
  page: tt.withFallback(tt.NumberFromString, 1),
});

export type Params = t.TypeOf<typeof paramsCodec>;

const pageSize = 10;

const isFollowing = (ports: Ports) => (groupId: GroupId, user: Params['user']) => pipe(
  user,
  O.fold(
    () => false,
    (u) => ports.isFollowing(groupId)(u.id),
  ),
);

type ConstructViewModel = (ports: Ports) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (ports) => (params) => pipe(
  ports.getGroupBySlug(params.slug),
  E.fromOption(() => DE.notFound),
  E.chain((group) => pipe(
    group.id,
    findFollowers(ports),
    paginate(params.page, pageSize),
    E.map((pageOfFollowers) => ({
      group,
      pageNumber: params.page,
      isFollowing: isFollowing(ports)(group.id, params.user),
      followerCount: pageOfFollowers.numberOfOriginalItems,
      followers: augmentWithUserDetails(ports)(pageOfFollowers.items),
      nextLink: paginationControls(`/groups/${group.slug}/followers?`, pageOfFollowers.nextPage),
      tabs: constructTabsViewModel(ports, group),
    })),
  )),
  TE.fromEither,
);
