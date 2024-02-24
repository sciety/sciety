import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as ER from './error-response.js';
import { filterByParams } from './filter-by-params.js';
import { identifyAllPossibleIndexEntries } from './identify-all-possible-index-entries.js';
import { constructDocmapViewModel } from '../docmap/construct-docmap-view-model.js';
import { supportedGroups } from '../supported-groups.js';
import { Params } from './params.js';
import { DocmapIndexViewModel } from './view-model.js';
import { Dependencies } from './dependencies.js';

type ConstructDocmapIndexViewModel = (dependencies: Dependencies)
=> (params: Params)
=> TE.TaskEither<ER.ErrorResponse, DocmapIndexViewModel>;

export const constructViewModel: ConstructDocmapIndexViewModel = (dependencies) => (params) => pipe(
  identifyAllPossibleIndexEntries(supportedGroups, dependencies),
  E.chain(filterByParams(params)),
  TE.fromEither,
  TE.chainW(flow(
    TE.traverseArray(constructDocmapViewModel(dependencies)),
    TE.mapLeft(() => ER.internalServerError),
  )),
);
