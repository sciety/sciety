import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as LOID from '../../../types/list-owner-id';
import { GetAllEvents, GetGroupBySlug, SelectAllListsOwnedBy } from '../../../shared-ports';
import { isFollowing } from '../../../shared-read-models/followings-stateless';
import { userIdCodec } from '../../../types/user-id';
import * as DE from '../../../types/data-error';
import { ActiveTab, ViewModel } from '../view-model';
import { ContentModel, TabIndex } from '../content-model';
import { findFollowers, Ports as FindFollowersPorts } from '../followers/find-followers';
import { constructListsTab } from '../lists/lists';
import { constructAboutTab, Ports as AboutPorts } from '../about/about';
import { constructFollowersTab, Ports as FollowersPorts } from '../followers/followers';

export type Ports = AboutPorts & FindFollowersPorts & FollowersPorts & {
  getAllEvents: GetAllEvents,
  getGroupBySlug: GetGroupBySlug,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

const constructActiveTabModel = (
  ports: Ports,
) => (contentModel: ContentModel): TE.TaskEither<DE.DataError, ActiveTab> => {
  switch (contentModel.activeTabIndex) {
    case 0:
      return pipe(
        contentModel,
        constructListsTab,
        TE.right,
      );
    case 1:
      return pipe(
        contentModel,
        constructAboutTab(ports),
      );
    default:
      return pipe(
        contentModel,
        constructFollowersTab(ports),
        TE.fromEither,
      );
  }
};

export const paramsCodec = t.type({
  slug: t.string,
  user: tt.optionFromNullable(t.type({
    id: userIdCodec,
  })),
  page: tt.withFallback(tt.NumberFromString, 1),
});

export type Params = t.TypeOf<typeof paramsCodec>;

type ConstructViewModel = (
  ports: Ports,
  activeTabIndex: TabIndex
) => (
  params: Params
) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (ports, activeTabIndex) => (params) => pipe(
  ports.getGroupBySlug(params.slug),
  E.fromOption(() => DE.notFound),
  TE.fromEither,
  TE.chainTaskK((group) => pipe(
    {
      activeTabIndex: T.of(activeTabIndex),
      pageNumber: T.of(params.page),
      group: T.of(group),
      isFollowing: pipe(
        params.user,
        O.fold(
          () => T.of(false),
          (u) => pipe(
            ports.getAllEvents,
            T.map(isFollowing(u.id, group.id)),
          ),
        ),
      ),
      followers: pipe(
        group.id,
        findFollowers(ports),
        T.of,
      ),
      lists: pipe(
        group.id,
        LOID.fromGroupId,
        ports.selectAllListsOwnedBy,
        T.of,
      ),
    },
    sequenceS(T.ApplyPar),
  )),
  TE.chain((partial) => pipe(
    partial,
    constructActiveTabModel(ports),
    TE.map((activeTab) => ({
      ...partial,
      activeTab,
    })),
  )),
);
