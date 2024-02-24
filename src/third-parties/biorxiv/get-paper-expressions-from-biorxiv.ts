import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as DE from '../../types/data-error.js';
import * as EDOI from '../../types/expression-doi.js';
import { ColdSpringHarborServer } from '../cold-spring-harbor-server.js';
import { ResponseWithVersions } from './biorxiv-details-api-response.js';
import { fetchArticleDetails } from './fetch-article-details.js';
import { ArticleId } from '../../types/article-id.js';
import { PaperExpression } from '../../types/paper-expression.js';
import { Logger } from '../../infrastructure/index.js';
import { QueryExternalService } from '../query-external-service.js';

type Dependencies = {
  queryExternalService: QueryExternalService,
  logger: Logger,
};

const mapResponse = (expressionsDoi: EDOI.ExpressionDoi, expressionsServer: ColdSpringHarborServer) => flow(
  (response: ResponseWithVersions) => response.collection,
  RA.map(({ version, date }) => ({
    expressionType: 'preprint' as const,
    expressionDoi: expressionsDoi,
    publisherHtmlUrl: new URL(`https://www.${expressionsServer}.org/content/${expressionsDoi}v${version}`),
    publishedAt: date,
    publishedTo: `${expressionsDoi}v${version}`,
    server: O.some(expressionsServer),
  })),
);

type GetPaperExpressionsFromBiorxiv = (
  doi: EDOI.ExpressionDoi,
  server: ColdSpringHarborServer,
) => TE.TaskEither<DE.DataError, ReadonlyArray<PaperExpression>>;

export const getPaperExpressionsFromBiorxiv = (
  deps: Dependencies,
): GetPaperExpressionsFromBiorxiv => (doi, server) => pipe(
  fetchArticleDetails(deps, new ArticleId(doi), server),
  TE.map(mapResponse(doi, server)),
);
