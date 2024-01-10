import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { getArticleVersionEventsFromBiorxiv } from './biorxiv';
import { fetchAllPaperExpressions as fetchAllPaperExpressionsFromCrossref } from './crossref';
import { QueryExternalService } from './query-external-service';
import { Logger } from '../shared-ports';
import { ArticleId } from '../types/article-id';
import { ExternalQueries } from './external-queries';

export const findAllExpressionsOfPaper = (
  queryCrossrefService: QueryExternalService,
  queryExternalService: QueryExternalService,
  crossrefApiBearerToken: O.Option<string>,
  logger: Logger,
): ExternalQueries['findAllExpressionsOfPaper'] => (expressionDoi, server) => {
  if (server !== 'biorxiv' && server !== 'medrxiv') {
    const headers: Record<string, string> = { };
    if (O.isSome(crossrefApiBearerToken)) {
      headers['Crossref-Plus-API-Token'] = `Bearer ${crossrefApiBearerToken.value}`;
    }
    return pipe(
      fetchAllPaperExpressionsFromCrossref(
        queryCrossrefService(undefined, headers),
        logger,
        expressionDoi,
      ),
    );
  }

  return getArticleVersionEventsFromBiorxiv({ queryExternalService, logger })(new ArticleId(expressionDoi), server);
};
