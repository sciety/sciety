import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { getPaperExpressionsFromBiorxiv } from './biorxiv/index.js';
import { fetchAllPaperExpressions as fetchAllPaperExpressionsFromCrossref } from './crossref/index.js';
import { QueryExternalService } from './query-external-service.js';
import { Logger } from '../infrastructure/index.js';
import { ExternalQueries } from './external-queries.js';
import { expandMonolithicBiorxivOrMedrxivExpressions } from './expand-monolithic-biorxiv-or-medrxiv-expressions.js';
import * as PH from '../types/publishing-history.js';
import * as DE from '../types/data-error.js';
import { ExpressionDoi } from '../types/expression-doi.js';

const setupCrossrefHeaders = (bearerToken: O.Option<string>) => {
  const headers: Record<string, string> = { };
  if (O.isSome(bearerToken)) {
    headers['Crossref-Plus-API-Token'] = `Bearer ${bearerToken.value}`;
  }
  return headers;
};

const logFailuresToGeneratePublishingHistory = (
  logger: Logger,
  expressionDoi: ExpressionDoi,
) => (
  publishingHistoryFailure: PH.PublishingHistoryFailure,
): DE.DataError => {
  switch (publishingHistoryFailure) {
    case 'empty-publishing-history':
      logger('error', 'Publishing history is empty', { expressionDoi });
      break;
    case 'no-preprints-in-publishing-history':
      logger('info', 'No preprints found in the publishing history', { expressionDoi });
      break;
  }
  return DE.notFound;
};

export const fetchPublishingHistory = (
  queryCrossrefService: QueryExternalService,
  queryExternalService: QueryExternalService,
  crossrefApiBearerToken: O.Option<string>,
  logger: Logger,
): ExternalQueries['fetchPublishingHistory'] => (expressionDoi) => pipe(
  fetchAllPaperExpressionsFromCrossref(
    queryCrossrefService(undefined, setupCrossrefHeaders(crossrefApiBearerToken)),
    logger,
    expressionDoi,
  ),
  TE.chainTaskK((paperExpressions) => pipe(
    paperExpressions,
    expandMonolithicBiorxivOrMedrxivExpressions(
      getPaperExpressionsFromBiorxiv({ queryExternalService, logger }),
    ),
    TE.getOrElse(() => T.of(paperExpressions)),
  )),
  TE.chainEitherKW((expressions) => pipe(
    expressions,
    PH.fromExpressions,
    E.mapLeft(logFailuresToGeneratePublishingHistory(logger, expressionDoi)),
  )),
);
