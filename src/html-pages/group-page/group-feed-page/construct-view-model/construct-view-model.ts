import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../../../../types/data-error.js';
import { ViewModel } from '../view-model.js';
import { constructTabsViewModel } from '../../common-components/tabs-view-model.js';
import { Dependencies } from './dependencies.js';
import { constructContent } from './construct-content.js';
import { Params } from './params.js';

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
    constructContent(dependencies, partial.group, 10, params.page),
    TE.map((content) => ({
      ...partial,
      content,
    })),
  )),
);
