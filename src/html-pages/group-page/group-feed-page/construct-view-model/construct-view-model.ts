import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { userIdCodec } from '../../../../types/user-id';
import * as DE from '../../../../types/data-error';
import { ViewModel } from '../view-model';
import { constructTabsViewModel } from '../../common-components/tabs-view-model';
import { Dependencies } from './dependencies';
import { constructContent } from './construct-content';

export const paramsCodec = t.type({
  slug: t.string,
  user: tt.optionFromNullable(t.type({
    id: userIdCodec,
  })),
  page: tt.withFallback(tt.NumberFromString, 1),
});

export type Params = t.TypeOf<typeof paramsCodec>;

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  dependencies.getGroupBySlug(params.slug),
  O.map((group) => ({
    group,
    isFollowing: pipe(
      params.user,
      O.fold(
        () => false,
        (u) => dependencies.isFollowing(group.id)(u.id),
      ),
    ),
    tabs: constructTabsViewModel(dependencies, group),
  })),
  TE.fromOption(() => DE.notFound),
  TE.chain((partial) => pipe(
    constructContent(dependencies, partial.group.id, 10, params.page),
    TE.map((content) => ({
      ...partial,
      content,
    })),
  )),
);
