import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { constructDocmapViewModel } from './construct-view-model/construct-docmap-view-model';
import { Docmap } from './docmap-type';
import { renderDocmap } from './render-docmap';
import { articleIdCodec, ArticleId, toExpressionDoi } from '../../../../types/article-id';
import * as EDOI from '../../../../types/expression-doi';
import { DependenciesForViews } from '../../../dependencies-for-views';
import { supportedGroups } from '../supported-groups';

const getEvaluatingGroupIds = (dependencies: DependenciesForViews) => (doi: ArticleId) => pipe(
  dependencies.getEvaluationsOfExpression(EDOI.fromValidatedString(doi.value)),
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

const getDocmapViewModels = (dependencies: DependenciesForViews) => (articleId: ArticleId) => pipe(
  articleId,
  getEvaluatingGroupIds(dependencies),
  TE.rightTask,
  TE.chain(TE.traverseArray((groupId) => constructDocmapViewModel(dependencies)({
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
  dependencies: DependenciesForViews,
) => (
  candidateDoi: string,
): TE.TaskEither<{ status: StatusCodes, message: string }, ReadonlyArray<Docmap>> => pipe(
  candidateDoi,
  validateDoi,
  TE.fromEither,
  TE.chainW(getDocmapViewModels(dependencies)),
  TE.map(RA.map(renderDocmap)),
  TE.chainEitherKW(errorOnEmpty),
);
