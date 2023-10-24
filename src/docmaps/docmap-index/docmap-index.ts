import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as E from 'fp-ts/Either';
import * as ER from './error-response';
import { decodeParams, filterByParams } from './filter-by-params';
import { identifyAllPossibleIndexEntries, Ports as IdentifyAllPossibleIndexEntriesDependencies } from './identify-all-possible-index-entries';
import { Ports as DocmapDependencies, constructDocmapViewModel } from '../docmap/construct-docmap-view-model';
import { renderDocmap } from '../docmap/render-docmap';
import { supportedGroups } from '../supported-groups';
import { Params } from './params';
import { DocmapIndexViewModel } from './view-model';

export type Dependencies = DocmapDependencies & IdentifyAllPossibleIndexEntriesDependencies;

type DocmapIndexBody = {
  articles?: ReadonlyArray<unknown>,
  error?: string,
};

type ConstructDocmapIndexViewModel = (dependencies: Dependencies)
=> (params: Params)
=> TE.TaskEither<ER.ErrorResponse, DocmapIndexViewModel>;

export const constructDocmapIndexViewModel: ConstructDocmapIndexViewModel = (dependencies) => (params) => pipe(
  identifyAllPossibleIndexEntries(supportedGroups, dependencies),
  E.chain(filterByParams(params)),
  TE.fromEither,
  TE.chainW(flow(
    TE.traverseArray(constructDocmapViewModel(dependencies)),
    TE.mapLeft(() => ER.internalServerError),
  )),
);

type DocmapIndex = (dependencies: Dependencies) => (query: Record<string, unknown>) => T.Task<{
  body: DocmapIndexBody,
  status: StatusCodes,
}>;

export const docmapIndex: DocmapIndex = (dependencies) => (query) => pipe(
  query,
  decodeParams,
  TE.fromEither,
  TE.chain(constructDocmapIndexViewModel(dependencies)),
  TE.map(RA.map(renderDocmap)),
  TE.map((docmaps) => ({
    body: { articles: docmaps },
    status: StatusCodes.OK,
  })),
  TE.toUnion,
);
