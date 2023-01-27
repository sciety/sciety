import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as LOID from '../../../types/list-owner-id';
import { contentComponent, Ports as ContentComponentPorts } from '../content-component';
import { GetAllEvents, GetGroupBySlug, SelectAllListsOwnedBy } from '../../../shared-ports';
import { isFollowing } from '../../../shared-read-models/followings';
import { UserIdFromString } from '../../../types/codecs/UserIdFromString';
import * as DE from '../../../types/data-error';
import { ViewModel } from '../view-model';
import { TabIndex } from '../content-model';
import { findFollowers } from '../followers/find-followers';

export type Ports = ContentComponentPorts & {
  getAllEvents: GetAllEvents,
  getGroupBySlug: GetGroupBySlug,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

export const paramsCodec = t.type({
  slug: t.string,
  user: tt.optionFromNullable(t.type({
    id: UserIdFromString,
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
        ports.getAllEvents,
        T.map(findFollowers(group.id)),
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
    contentComponent(ports),
    TE.map((activeTabContent) => ({
      ...partial,
      activeTabContent,
    })),
  )),
);
