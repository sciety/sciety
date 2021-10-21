import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as ER from './error-response';
import { filterByParams } from './filter-by-params';
import { identifyAllPossibleIndexEntries, Ports as IdentifyAllPossibleIndexEntriesPorts } from './identify-all-possible-index-entries';
import { DomainEvent } from '../../domain-events';
import { Ports as DocmapPorts, generateDocmapViewModel } from '../docmap/generate-docmap-view-model';
import { toDocmap } from '../docmap/to-docmap';
import { supportedGroups } from '../supported-groups';

type Ports = DocmapPorts & IdentifyAllPossibleIndexEntriesPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

type DocmapIndexBody = {
  articles?: ReadonlyArray<unknown>,
  error?: string,
};

type DocmapIndex = (ports: Ports) => (query: Record<string, unknown>) => T.Task<{
  body: DocmapIndexBody,
  status: StatusCodes,
}>;

export const docmapIndex: DocmapIndex = (ports) => (query) => pipe(
  ports.getAllEvents,
  TE.rightTask,
  TE.chain(identifyAllPossibleIndexEntries(supportedGroups, ports)),
  TE.chainEitherK(filterByParams(query)),
  TE.chainW(flow(
    TE.traverseArray(generateDocmapViewModel(ports)),
    TE.mapLeft(() => ER.internalServerError),
  )),
  TE.map(RA.map(toDocmap)),
  TE.map((docmaps) => ({
    body: { articles: docmaps },
    status: StatusCodes.OK,
  })),
  TE.toUnion,
);
