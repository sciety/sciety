import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import * as DE from '../types/data-error';
import { getArticleVersionEventsFromBiorxiv } from './biorxiv';
import { fetchAllPaperExpressions } from './crossref';
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
  if (server === 'biorxiv' || server === 'medrxiv') {
    return pipe(
      getArticleVersionEventsFromBiorxiv({ queryExternalService, logger })(new ArticleId(expressionDoi), server),
      T.map(E.fromOption(() => DE.notFound)),
    );
  }
  const headers: Record<string, string> = { };
  if (O.isSome(crossrefApiBearerToken)) {
    headers['Crossref-Plus-API-Token'] = `Bearer ${crossrefApiBearerToken.value}`;
  }
  return pipe(
    fetchAllPaperExpressions(
      queryCrossrefService(undefined, headers),
      logger,
      expressionDoi,
    ),
  );
};
