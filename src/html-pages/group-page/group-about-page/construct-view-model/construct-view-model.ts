import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { sequenceS } from 'fp-ts/Apply';
import { userIdCodec } from '../../../../types/user-id';
import * as DE from '../../../../types/data-error';
import { ViewModel } from '../view-model';
import { constructTabsViewModel } from '../../common-components/tabs-view-model';
import { toOurListsViewModel } from './to-our-lists-view-model';
import { Dependencies } from './dependencies';

export const paramsCodec = t.type({
  slug: t.string,
  user: tt.optionFromNullable(t.type({
    id: userIdCodec,
  })),
});

export type Params = t.TypeOf<typeof paramsCodec>;

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  dependencies.getGroupBySlug(params.slug),
  TE.fromOption(() => DE.notFound),
  TE.chain((group) => pipe(
    {
      group: TE.right(group),
      isFollowing: pipe(
        params.user,
        O.fold(
          () => false,
          (u) => dependencies.isFollowing(group.id)(u.id),
        ),
        TE.right,
      ),
      tabs: TE.right(constructTabsViewModel(dependencies, group)),
      ourLists: pipe(
        toOurListsViewModel(dependencies, group.id, group.slug),
        TE.right,
      ),
      markdown: dependencies.fetchStaticFile(`groups/${group.descriptionPath}`),
    },
    sequenceS(TE.ApplyPar),
  )),
);
