import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as E from 'fp-ts/Either';
import * as ER from './error-response';
import { filterByParams } from './filter-by-params';
import { identifyAllPossibleIndexEntries, Ports as IdentifyAllPossibleIndexEntriesPorts } from './identify-all-possible-index-entries';
import { Ports as DocmapPorts, DocmapViewModel, constructDocmapViewModel } from '../docmap/construct-docmap-view-model';
import { renderDocmap } from '../docmap/render-docmap';
import { supportedGroups } from '../supported-groups';

export type Ports = DocmapPorts & IdentifyAllPossibleIndexEntriesPorts;

type DocmapIndexBody = {
  articles?: ReadonlyArray<unknown>,
  error?: string,
};

export type DocmapIndexViewModel = ReadonlyArray<DocmapViewModel>;

type ConstructDocmapIndexViewModel = (adapters: Ports)
=> (query: unknown)
=> TE.TaskEither<ER.ErrorResponse, DocmapIndexViewModel>;

export const constructDocmapIndexViewModel: ConstructDocmapIndexViewModel = () => () => TE.right([]);

type DocmapIndex = (adapters: Ports) => (query: Record<string, unknown>) => T.Task<{
  body: DocmapIndexBody,
  status: StatusCodes,
}>;

export const docmapIndex: DocmapIndex = (adapters) => (query) => pipe(
  identifyAllPossibleIndexEntries(supportedGroups, adapters),
  E.chain(filterByParams(query)),
  TE.fromEither,
  TE.chainW(flow(
    TE.traverseArray(constructDocmapViewModel(adapters)),
    TE.mapLeft(() => ER.internalServerError),
  )),
  (foo) => foo,
  TE.map(RA.map(renderDocmap)),
  TE.map((docmaps) => ({
    body: { articles: docmaps },
    status: StatusCodes.OK,
  })),
  TE.toUnion,
);
