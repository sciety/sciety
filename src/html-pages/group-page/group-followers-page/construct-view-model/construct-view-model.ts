import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as LOID from '../../../../types/list-owner-id';
import { GetGroupBySlug, IsFollowing, SelectAllListsOwnedBy } from '../../../../shared-ports';
import { userIdCodec } from '../../../../types/user-id';
import * as DE from '../../../../types/data-error';
import { FollowersTab, ViewModel } from '../view-model';
import { ContentModel } from '../content-model';
import { findFollowers, Ports as FindFollowersPorts } from './find-followers';
import { constructFollowersTab, Ports as FollowersPorts } from './followers';

export type Ports = FindFollowersPorts & FollowersPorts & {
  getGroupBySlug: GetGroupBySlug,
  isFollowing: IsFollowing,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

const constructActiveTabModel = (
  ports: Ports,
) => (contentModel: ContentModel): E.Either<DE.DataError, FollowersTab> => pipe(
  contentModel,
  constructFollowersTab(ports),
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
  E.fromOption(() => DE.notFound),
  E.chain((partial) => pipe(
    partial,
    constructActiveTabModel(ports),
    E.map((activeTab) => ({
      ...partial,
      activeTab,
    })),
  )),
  TE.fromEither,
);
