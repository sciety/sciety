import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { IsFollowing } from '../../../../shared-ports';
import { userIdCodec } from '../../../../types/user-id';
import * as DE from '../../../../types/data-error';
import { ViewModel } from '../view-model';
import { constructListCards, Ports as ConstructListCardsPorts } from './construct-list-cards';
import { constructTabsViewModel, Ports as TabsViewModelPorts } from '../../common-components/tabs-view-model';
import { Queries } from '../../../../shared-read-models';

export type Ports = ConstructListCardsPorts & TabsViewModelPorts & {
  getGroupBySlug: Queries['getGroupBySlug'],
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
      listCards: constructListCards(ports, group),
      tabs: constructTabsViewModel(ports, group),
    },
  )),
  TE.fromOption(() => DE.notFound),
);
