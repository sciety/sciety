import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as E from 'fp-ts/Either';
import * as ER from './error-response';
import { filterByParams } from './filter-by-params';
import { identifyAllPossibleIndexEntries, Ports as IdentifyAllPossibleIndexEntriesPorts } from './identify-all-possible-index-entries';
import { Ports as DocmapPorts, generateDocmapViewModel } from '../docmap/generate-docmap-view-model';
import { toDocmap } from '../docmap/to-docmap';
import { supportedGroups } from '../supported-groups';

export type Ports = DocmapPorts & IdentifyAllPossibleIndexEntriesPorts;

type DocmapIndexBody = {
  articles?: ReadonlyArray<unknown>,
  error?: string,
};

type DocmapIndex = (adapters: Ports) => (query: Record<string, unknown>) => T.Task<{
  body: DocmapIndexBody,
  status: StatusCodes,
}>;

export const docmapIndex: DocmapIndex = (adapters) => (query) => pipe(
  identifyAllPossibleIndexEntries(supportedGroups, adapters),
  E.chain(filterByParams(query)),
  TE.fromEither,
  TE.chainW(flow(
    TE.traverseArray(generateDocmapViewModel(adapters)),
    TE.mapLeft(() => ER.internalServerError),
  )),
  TE.map(RA.map(toDocmap)),
  TE.map((docmaps) => ({
    body: { articles: docmaps },
    status: StatusCodes.OK,
  })),
  TE.toUnion,
);
