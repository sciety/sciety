import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe, tupled } from 'fp-ts/function';
import {
  fetchExtraDetails,
  Ports as FetchExtraDetailsPorts,
} from './fetch-extra-details';
import { Params, performAllSearches, Ports as PerformAllSearchesPorts } from './perform-all-searches';
import { renderErrorPage, RenderPage, renderPage } from './render-page';
import { selectSubsetToDisplay } from './select-subset-to-display';

import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';

type FindVersionsForArticleDoi = (
  doi: Doi,
  server: ArticleServer,
) => TO.TaskOption<RNEA.ReadonlyNonEmptyArray<{ occurredAt: Date }>>;

type Ports = PerformAllSearchesPorts & {
  findReviewsForArticleDoi: FetchExtraDetailsPorts['findReviewsForArticleDoi'],
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getAllEvents: FetchExtraDetailsPorts['getAllEvents'],
};

type SearchResultsPage = (ports: Ports) => (pageSize: number) => (params: Params) => ReturnType<RenderPage>;

export const searchResultsPage: SearchResultsPage = (ports) => (pageSize) => (params) => pipe(
  params,
  performAllSearches(ports)(pageSize),
  TE.map(selectSubsetToDisplay),
  TE.chainTaskK(fetchExtraDetails({
    ...ports,
    getLatestArticleVersionDate: (doi, server) => pipe(
      [doi, server],
      tupled(ports.findVersionsForArticleDoi),
      TO.map(flow(
        RNEA.last,
        (version) => version.occurredAt,
      )),
    ),
  })),
  TE.bimap(renderErrorPage, renderPage),
);
