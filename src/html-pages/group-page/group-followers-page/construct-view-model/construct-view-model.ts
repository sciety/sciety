import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { paginationControls } from '../../../../shared-components/pagination-controls';
import { paginate } from './paginate';
import { augmentWithUserDetails } from './augment-with-user-details';
import { userIdCodec } from '../../../../types/user-id';
import * as DE from '../../../../types/data-error';
import { ViewModel } from '../view-model';
import { findFollowers } from './find-followers';
import { constructTabsViewModel } from '../../common-components/tabs-view-model';
import { GroupId } from '../../../../types/group-id';
import { Dependencies } from './dependencies';

export const paramsCodec = t.type({
  slug: t.string,
  user: tt.optionFromNullable(t.type({
    id: userIdCodec,
  })),
  page: tt.withFallback(tt.NumberFromString, 1),
});

export type Params = t.TypeOf<typeof paramsCodec>;

const pageSize = 10;

const isFollowing = (dependencies: Dependencies) => (groupId: GroupId, user: Params['user']) => pipe(
  user,
  O.fold(
    () => false,
    (u) => dependencies.isFollowing(groupId)(u.id),
  ),
);

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  dependencies.getGroupBySlug(params.slug),
  E.fromOption(() => DE.notFound),
  E.chain((group) => pipe(
    group.id,
    findFollowers(dependencies),
    paginate(params.page, pageSize),
    E.map((pageOfFollowers) => ({
      group,
      pageNumber: params.page,
      isFollowing: isFollowing(dependencies)(group.id, params.user),
      followerCount: pageOfFollowers.numberOfOriginalItems,
      followers: augmentWithUserDetails(dependencies)(pageOfFollowers.items),
      nextLink: paginationControls(`/groups/${group.slug}/followers?`, pageOfFollowers.nextPage),
      tabs: constructTabsViewModel(dependencies, group),
    })),
  )),
  TE.fromEither,
);
