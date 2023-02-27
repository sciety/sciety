import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { GetGroupBySlug, IsFollowing } from '../../../../shared-ports';
import { userIdCodec } from '../../../../types/user-id';
import * as DE from '../../../../types/data-error';
import { ViewModel } from '../view-model';
import { findFollowers, Ports as FindFollowersPorts } from '../followers/find-followers';
import { constructListCards, Ports as ConstructListCardsPorts } from './construct-list-cards';

export type Ports = FindFollowersPorts & ConstructListCardsPorts & {
  getGroupBySlug: GetGroupBySlug,
  isFollowing: IsFollowing,
};

export const paramsCodec = t.type({
  slug: t.string,
  user: tt.optionFromNullable(t.type({
    id: userIdCodec,
  })),
});

export type Params = t.TypeOf<typeof paramsCodec>;

type ConstructViewModel = (ports: Ports) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (ports) => (params) => pipe(
  ports.getGroupBySlug(params.slug),
  O.map((group) => pipe(
    {
      group,
      isFollowing: pipe(
        params.user,
        O.fold(
          () => false,
          (u) => ports.isFollowing(group.id)(u.id),
        ),
      ),
      followers: findFollowers(ports)(group.id),
      lists: constructListCards(ports, group),
      listCards: constructListCards(ports, group),
    },
  )),
  TE.fromOption(() => DE.notFound),
);
