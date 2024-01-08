import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as EDOI from '../../types/expression-doi';
import { SupportedArticleServer } from './article-server-with-version-information';
import { ResponseWithVersions } from './biorxiv-details-api-response';
import { fetchArticleDetails } from './fetch-article-details';
import { ArticleId } from '../../types/article-id';
import { PaperExpression } from '../../types/paper-expression';
import { Logger } from '../../shared-ports';
import { QueryExternalService } from '../query-external-service';

type Dependencies = {
  queryExternalService: QueryExternalService,
  logger: Logger,
};

type GetArticleVersionEventsFromBiorxiv = (
  doi: ArticleId,
  server: SupportedArticleServer,
) => T.Task<O.Option<RNEA.ReadonlyNonEmptyArray<PaperExpression>>>;

const mapResponse = (doi: ArticleId, server: SupportedArticleServer) => flow(
  (response: ResponseWithVersions) => response.collection,
  RNEA.map(({ version, date }) => ({
    expressionDoi: EDOI.fromValidatedString(doi.value),
    publisherHtmlUrl: new URL(`https://www.${server}.org/content/${doi.value}v${version}`),
    publishedAt: date,
  })),
);

export const getArticleVersionEventsFromBiorxiv = (
  deps: Dependencies,
): GetArticleVersionEventsFromBiorxiv => (doi, server) => pipe(
  fetchArticleDetails(deps, doi, server),
  TE.map(mapResponse(doi, server)),
  T.map(O.fromEither),
);
