import { URL } from 'url';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as ER from './error-response';
import { filterByParams } from './filter-by-params';
import { identifyAllPossibleIndexEntries, Ports as IdentifyAllPossibleIndexEntriesPorts } from './identify-all-possible-index-entries';
import { DomainEvent } from '../../domain-events';
import * as GID from '../../types/group-id';
import { Ports as DocmapPorts, generateDocmapViewModel } from '../docmap/generate-docmap-view-model';
import { toDocmap } from '../docmap/to-docmap';

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

const avoidRateLimitingWithDummyValues = (ports: Ports): Ports => ({
  ...ports,
  fetchReview: () => TE.right({
    url: new URL(`https://example.com/source-url-of-evaluation-${Math.random()}`),
  }),
});

const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');
const rapidReviewsGroupId = GID.fromValidatedString('5142a5bc-6b18-42b1-9a8d-7342d7d17e94');

const supportedGroups = [ncrcGroupId, rapidReviewsGroupId];

export const docmapIndex: DocmapIndex = (ports) => (query) => pipe(
  ports.getAllEvents,
  TE.rightTask,
  TE.chain(identifyAllPossibleIndexEntries(supportedGroups, ports)),
  TE.chainEitherK(filterByParams(query)),
  TE.chainW(flow(
    TE.traverseArray(generateDocmapViewModel(avoidRateLimitingWithDummyValues(ports))),
    TE.mapLeft(() => ER.internalServerError),
  )),
  TE.map(RA.map(toDocmap)),
  TE.map((docmaps) => ({
    body: { articles: docmaps },
    status: StatusCodes.OK,
  })),
  TE.toUnion,
);
