import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { getArticleVersionEventsFromBiorxiv } from './biorxiv';
import { fetchAllPaperExpressions as fetchAllPaperExpressionsFromCrossref } from './crossref';
import { QueryExternalService } from './query-external-service';
import { Logger } from '../shared-ports';
import { ExternalQueries } from './external-queries';
import { expandMonolithicBiorxivOrMedrxivExpressions } from './expand-monolithic-biorxiv-or-medrxiv-expressions';
import * as PES from '../types/paper-expressions';
import * as DE from '../types/data-error';
import { PaperExpression } from '../types/paper-expression';

const setupCrossrefHeaders = (bearerToken: O.Option<string>) => {
  const headers: Record<string, string> = { };
  if (O.isSome(bearerToken)) {
    headers['Crossref-Plus-API-Token'] = `Bearer ${bearerToken.value}`;
  }
  return headers;
};

const hasAtLeastOneWorkAsPostedContent = (
  paperExpressions: ReadonlyArray<PaperExpression>,
): boolean => pipe(
  paperExpressions,
  RA.some((paperExpression) => paperExpression.expressionType === 'preprint'),
);

export const findAllExpressionsOfPaper = (
  queryCrossrefService: QueryExternalService,
  queryExternalService: QueryExternalService,
  crossrefApiBearerToken: O.Option<string>,
  logger: Logger,
): ExternalQueries['findAllExpressionsOfPaper'] => (expressionDoi) => pipe(
  fetchAllPaperExpressionsFromCrossref(
    queryCrossrefService(undefined, setupCrossrefHeaders(crossrefApiBearerToken)),
    logger,
    expressionDoi,
  ),
  TE.chain(expandMonolithicBiorxivOrMedrxivExpressions(
    getArticleVersionEventsFromBiorxiv({ queryExternalService, logger }),
  )),
  TE.filterOrElseW(
    hasAtLeastOneWorkAsPostedContent,
    () => {
      logger('info', 'No Crossref posted-content works found', { expressionDoi });
      return DE.notFound;
    },
  ),
  TE.map(PES.fromExpressions),
  TE.filterOrElseW(
    (paperExpressions) => paperExpressions.expressions.length > 0,
    () => {
      logger('error', 'findAllExpressionsOfPaper returned an empty array', { expressionDoi });
      return DE.notFound;
    },
  ),
);
