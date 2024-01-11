import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { getArticleVersionEventsFromBiorxiv } from './biorxiv';
import { fetchAllPaperExpressions as fetchAllPaperExpressionsFromCrossref } from './crossref';
import { QueryExternalService } from './query-external-service';
import { Logger } from '../shared-ports';
import { ExternalQueries } from './external-queries';
import { replaceOneMonolithicBiorxivOrMedrxivExpressionWithGranularOnes } from './replace-one-monolithic-biorxiv-or-medrxiv-expression-with-granular-ones';

const setupCrossrefHeaders = (bearerToken: O.Option<string>) => {
  const headers: Record<string, string> = { };
  if (O.isSome(bearerToken)) {
    headers['Crossref-Plus-API-Token'] = `Bearer ${bearerToken.value}`;
  }
  return headers;
};

export const findAllExpressionsOfPaper = (
  queryCrossrefService: QueryExternalService,
  queryExternalService: QueryExternalService,
  crossrefApiBearerToken: O.Option<string>,
  logger: Logger,
): ExternalQueries['findAllExpressionsOfPaper'] => (expressionDoi, server) => pipe(
  fetchAllPaperExpressionsFromCrossref(
    queryCrossrefService(undefined, setupCrossrefHeaders(crossrefApiBearerToken)),
    logger,
    expressionDoi,
  ),
  TE.chain(replaceOneMonolithicBiorxivOrMedrxivExpressionWithGranularOnes(
    getArticleVersionEventsFromBiorxiv({ queryExternalService, logger }),
    server,
    expressionDoi,
  )),
);
