import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { getArticleVersionEventsFromBiorxiv } from './biorxiv';
import { fetchAllPaperExpressions as fetchAllPaperExpressionsFromCrossref } from './crossref';
import { QueryExternalService } from './query-external-service';
import { Logger } from '../shared-ports';
import { ExternalQueries } from './external-queries';
import { ArticleServer } from '../types/article-server';
import { ExpressionDoi } from '../types/expression-doi';
import { PaperExpression } from '../types/paper-expression';
import * as DE from '../types/data-error';
import { SupportedArticleServer } from './biorxiv/article-server-with-version-information';

type GetExpressionsFromBiorxiv = (expressionDoi: ExpressionDoi, server: SupportedArticleServer)
=> TE.TaskEither<DE.DataError, ReadonlyArray<PaperExpression>>;

const replaceOneMonolithicBiorxivOrMedrxivExpressionWithGranularOnes = (
  getExpressionsFromBiorxiv: GetExpressionsFromBiorxiv,
  server: ArticleServer,
  expressionDoi: ExpressionDoi,
) => (expressionsFromCrossref: ReadonlyArray<PaperExpression>) => pipe(
  (server === 'biorxiv' || server === 'medrxiv')
    ? pipe(
      getExpressionsFromBiorxiv(expressionDoi, server),
      TE.map((expressionsFromBiorxiv) => [
        expressionsFromBiorxiv,
        pipe(
          expressionsFromCrossref,
          RA.filter((paperExpression) => paperExpression.expressionDoi !== expressionDoi),
        ),
      ]),
      TE.map(RA.flatten),
    )
    : TE.right(expressionsFromCrossref),
);

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
