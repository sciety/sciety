import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as ER from './error-response';
import { filterByParams } from './filter-by-params';
import { identifyAllPossibleIndexEntries } from './identify-all-possible-index-entries';
import { constructDocmapViewModel } from '../docmap/construct-docmap-view-model';
import { supportedGroups } from '../supported-groups';
import { Params } from './params';
import { DocmapIndexViewModel } from './view-model';
import { Dependencies } from './dependencies';
import { toExpressionDoi } from '../../types/article-id';

type ConstructDocmapIndexViewModel = (dependencies: Dependencies)
=> (params: Params)
=> TE.TaskEither<ER.ErrorResponse, DocmapIndexViewModel>;

export const constructViewModel: ConstructDocmapIndexViewModel = (dependencies) => (params) => pipe(
  identifyAllPossibleIndexEntries(supportedGroups, dependencies),
  E.chain(filterByParams(params)),
  TE.fromEither,
  TE.map(RA.map((foo) => ({ ...foo, expressionDoi: toExpressionDoi(foo.articleId) }))),
  TE.chainW(flow(
    TE.traverseArray(constructDocmapViewModel(dependencies)),
    TE.mapLeft(() => ER.internalServerError),
  )),
);
