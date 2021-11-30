import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Docmap } from './docmap-type';
import { Ports as DocmapPorts, generateDocmapViewModel } from './generate-docmap-view-model';
import { toDocmap } from './to-docmap';
import { DomainEvent, isEvaluationRecordedEvent } from '../../domain-events';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { Doi } from '../../types/doi';
import { supportedGroups } from '../supported-groups';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const getEvaluatingGroupIds = (getAllEvents: GetAllEvents) => (doi: Doi) => pipe(
  getAllEvents,
  T.map(flow(
    RA.filter(isEvaluationRecordedEvent),
    RA.filter(({ articleId }) => articleId.value === doi.value),
    RA.filter(({ groupId }) => supportedGroups.includes(groupId)),
    RA.map(({ groupId }) => groupId),
    (groupIds) => [...new Set(groupIds)],
  )),
);

type Ports = {
  getAllEvents: GetAllEvents,
} & DocmapPorts;

export const generateDocmaps = (
  ports: Ports,
) => (
  candidateDoi: string,
): TE.TaskEither<{ status: StatusCodes, message: string }, ReadonlyArray<Docmap>> => pipe(
  candidateDoi,
  DoiFromString.decode,
  E.mapLeft(() => ({ status: StatusCodes.BAD_REQUEST, message: 'Invalid DOI requested' })),
  TE.fromEither,
  TE.chainW((articleId) => pipe(
    articleId,
    getEvaluatingGroupIds(ports.getAllEvents),
    TE.rightTask,
    TE.chain(TE.traverseArray((groupId) => generateDocmapViewModel(ports)({ articleId, groupId }))),
    TE.bimap(
      () => ({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Failed to generate docmaps' }),
      RA.map(toDocmap),
    ),
  )),
);
