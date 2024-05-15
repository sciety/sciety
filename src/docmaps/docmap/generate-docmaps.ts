import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Ports as DocmapPorts, constructDocmapViewModel } from './construct-docmap-view-model';
import { Docmap } from './docmap-type';
import { renderDocmap } from './render-docmap';
import { Queries } from '../../read-models';
import { supportedGroups } from '../../read-side/non-html-views/docmaps/supported-groups';
import { articleIdCodec, ArticleId, toExpressionDoi } from '../../types/article-id';
import * as EDOI from '../../types/expression-doi';

export type Ports = DocmapPorts & Queries;

const getEvaluatingGroupIds = (ports: Ports) => (doi: ArticleId) => pipe(
  ports.getEvaluationsOfExpression(EDOI.fromValidatedString(doi.value)),
  T.of,
  T.map(flow(
    RA.filter(({ expressionDoi }) => expressionDoi === doi.value),
    RA.filter(({ groupId }) => supportedGroups.includes(groupId)),
    RA.map(({ groupId }) => groupId),
    (groupIds) => [...new Set(groupIds)],
  )),
);

const validateDoi = flow(
  articleIdCodec.decode,
  E.mapLeft(() => ({ status: StatusCodes.BAD_REQUEST, message: 'Invalid DOI requested' })),
);

const getDocmapViewModels = (ports: Ports) => (articleId: ArticleId) => pipe(
  articleId,
  getEvaluatingGroupIds(ports),
  TE.rightTask,
  TE.chain(TE.traverseArray((groupId) => constructDocmapViewModel(ports)({
    expressionDoi: toExpressionDoi(articleId),
    groupId,
  }))),
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
  TE.map(RA.map(renderDocmap)),
  TE.chainEitherKW(errorOnEmpty),
);
