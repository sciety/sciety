import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import * as ER from './error-response';
import { filterByParams } from './filter-by-params';
import { identifyAllPossibleIndexEntries } from './identify-all-possible-index-entries';
import { Params } from './params';
import { DocmapIndexViewModel } from './view-model';
import { constructDocmapViewModel } from '../../read-side/non-html-views/docmaps/docmap/construct-docmap-view-model';
import { supportedGroups } from '../../read-side/non-html-views/docmaps/supported-groups';

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
