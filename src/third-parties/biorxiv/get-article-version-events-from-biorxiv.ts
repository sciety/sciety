import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { BiorxivArticleDetails } from './BiorxivArticleDetails';
import { fetchArticleDetails } from './fetch-article-details';
import { Logger } from '../../infrastructure/logger';
import { ArticleServer } from '../../types/article-server';
import { Doi } from '../../types/doi';
import { GetJson } from '../../shared-ports';

type Dependencies = {
  getJson: GetJson,
  logger: Logger,
};

type ArticleVersion = {
  source: URL,
  publishedAt: Date,
  version: number,
};

export type GetArticleVersionEventsFromBiorxiv = (
  doi: Doi,
  server: ArticleServer,
) => T.Task<O.Option<RNEA.ReadonlyNonEmptyArray<ArticleVersion>>>;

const mapResponse = (doi: Doi, server: ArticleServer) => flow(
  (response: BiorxivArticleDetails) => response.collection,
  RNEA.map(({ version, date }) => ({
    source: new URL(`https://www.${server}.org/content/${doi.value}v${version}`),
    publishedAt: date,
    version,
  })),
);

export const getArticleVersionEventsFromBiorxiv = (
  deps: Dependencies,
): GetArticleVersionEventsFromBiorxiv => (doi, server) => pipe(
  fetchArticleDetails(doi, server)(deps),
  TE.map(mapResponse(doi, server)),
  T.map(O.fromEither),
);
