import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as ER from './error-response';
import { filterByParams } from './filter-by-params';
import { identifyAllPossibleIndexEntries } from './identify-all-possible-index-entries';
import { Params } from './params';
import { DocmapIndexViewModel } from './view-model';
import { DependenciesForViews } from '../../../dependencies-for-views';
import { constructDocmapViewModel } from '../docmap/construct-view-model/construct-docmap-view-model';
import { supportedGroups } from '../supported-groups';

type ConstructDocmapIndexViewModel = (dependencies: DependenciesForViews)
=> (params: Params)
=> TE.TaskEither<ER.ErrorResponse, DocmapIndexViewModel>;

export const constructViewModel: ConstructDocmapIndexViewModel = (dependencies) => (params) => pipe(
  identifyAllPossibleIndexEntries(supportedGroups, dependencies),
  E.flatMap(filterByParams(params)),
  TE.fromEither,
  TE.flatMap(flow(
    TE.traverseArray(constructDocmapViewModel(dependencies)),
    TE.mapLeft(() => ER.internalServerError),
  )),
);
