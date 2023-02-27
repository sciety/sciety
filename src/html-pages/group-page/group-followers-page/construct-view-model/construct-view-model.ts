import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as LOID from '../../../../types/list-owner-id';
import {
  GetAllEvents, GetGroupBySlug, IsFollowing, SelectAllListsOwnedBy,
} from '../../../../shared-ports';
import { userIdCodec } from '../../../../types/user-id';
import * as DE from '../../../../types/data-error';
import { ActiveTab, ViewModel } from '../view-model';
import { ContentModel } from '../content-model';
import { findFollowers, Ports as FindFollowersPorts } from '../followers/find-followers';
import { constructFollowersTab, Ports as FollowersPorts } from '../followers/followers';

export type Ports = FindFollowersPorts & FollowersPorts & {
  getAllEvents: GetAllEvents,
  getGroupBySlug: GetGroupBySlug,
  isFollowing: IsFollowing,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

const constructActiveTabModel = (
  ports: Ports,
) => (contentModel: ContentModel): TE.TaskEither<DE.DataError, ActiveTab> => pipe(
  contentModel,
  constructFollowersTab(ports),
  TE.fromEither,
);

export const paramsCodec = t.type({
  slug: t.string,
  user: tt.optionFromNullable(t.type({
    id: userIdCodec,
  })),
  page: tt.withFallback(tt.NumberFromString, 1),
});

export type Params = t.TypeOf<typeof paramsCodec>;

type ConstructViewModel = (ports: Ports) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (ports) => (params) => pipe(
  ports.getGroupBySlug(params.slug),
  O.map((group) => pipe(
    {
      pageNumber: params.page,
      group,
      isFollowing: pipe(
        params.user,
        O.fold(
          () => false,
          (u) => ports.isFollowing(group.id)(u.id),
        ),
      ),
      followers: findFollowers(ports)(group.id),
      lists: pipe(
        group.id,
        LOID.fromGroupId,
        ports.selectAllListsOwnedBy,
      ),
    },
  )),
  TE.fromOption(() => DE.notFound),
  TE.chain((partial) => pipe(
    partial,
    constructActiveTabModel(ports),
    TE.map((activeTab) => ({
      ...partial,
      activeTab,
    })),
  )),
);
