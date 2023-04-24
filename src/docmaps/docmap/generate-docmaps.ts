import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Docmap } from './docmap-type';
import { Ports as DocmapPorts, generateDocmapViewModel } from './generate-docmap-view-model';
import { toDocmap } from './to-docmap';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { Doi } from '../../types/doi';
import { supportedGroups } from '../supported-groups';
import { Queries } from '../../shared-read-models';

// ts-unused-exports:disable-next-line
export type Ports = DocmapPorts & {
  getEvaluationsForDoi: Queries['getEvaluationsForDoi'],
};

const getEvaluatingGroupIds = (ports: Ports) => (doi: Doi) => pipe(
  ports.getEvaluationsForDoi(doi),
  T.of,
  T.map(flow(
    RA.filter(({ articleId }) => articleId.value === doi.value),
    RA.filter(({ groupId }) => supportedGroups.includes(groupId)),
    RA.map(({ groupId }) => groupId),
    (groupIds) => [...new Set(groupIds)],
  )),
);

const validateDoi = flow(
  DoiFromString.decode,
  E.mapLeft(() => ({ status: StatusCodes.BAD_REQUEST, message: 'Invalid DOI requested' })),
);

const getDocmapViewModels = (ports: Ports) => (articleId: Doi) => pipe(
  articleId,
  getEvaluatingGroupIds(ports),
  TE.rightTask,
  TE.chain(TE.traverseArray((groupId) => generateDocmapViewModel(ports)({ articleId, groupId }))),
  TE.mapLeft(() => ({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Failed to generate docmaps' })),
);

const errorOnEmpty = E.fromPredicate(
  RA.isNonEmpty,
  () => ({ status: StatusCodes.NOT_FOUND, message: 'No Docmaps available for requested DOI' }),
);

export const generateDocmaps = (
  ports: Ports,
) => (
  candidateDoi: string,
): TE.TaskEither<{ status: StatusCodes, message: string }, ReadonlyArray<Docmap>> => pipe(
  candidateDoi,
  validateDoi,
  TE.fromEither,
  TE.chainW(getDocmapViewModels(ports)),
  TE.map(RA.map(toDocmap)),
  TE.chainEitherKW(errorOnEmpty),
);
