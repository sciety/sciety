import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { SupportedArticleServer } from './article-server-with-version-information';
import { ResponseWithVersions } from './biorxiv-details-api-response';
import { fetchArticleDetails } from './fetch-article-details';
import { Logger } from '../../infrastructure/logger';
import { Doi } from '../../types/doi';
import { GetJson } from '../../shared-ports';
import { ArticleVersion } from '../../types/article-version';

type Dependencies = {
  getJson: GetJson,
  logger: Logger,
};

type GetArticleVersionEventsFromBiorxiv = (
  doi: Doi,
  server: SupportedArticleServer,
) => T.Task<O.Option<RNEA.ReadonlyNonEmptyArray<ArticleVersion>>>;

const mapResponse = (doi: Doi, server: SupportedArticleServer) => flow(
  (response: ResponseWithVersions) => response.collection,
  RNEA.map(({ version, date }) => ({
    source: new URL(`https://www.${server}.org/content/${doi.value}v${version}`),
    publishedAt: date,
    version,
  })),
);

export const getArticleVersionEventsFromBiorxiv = (
  deps: Dependencies,
): GetArticleVersionEventsFromBiorxiv => (doi, server) => pipe(
  fetchArticleDetails(deps, doi, server),
  TE.map(mapResponse(doi, server)),
  T.map(O.fromEither),
);
