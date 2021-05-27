import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe, tupled } from 'fp-ts/function';
import {
  fetchExtraDetails, FindReviewsForArticleDoi, GetAllEvents, GetGroup,
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

export type Ports = PerformAllSearchesPorts & {
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getAllEvents: GetAllEvents,
  getGroup: GetGroup,
};

export { paramsCodec } from './perform-all-searches';

type SearchResultsPage = (params: Params) => ReturnType<RenderPage>;

export const searchResultsPage = (ports: Ports): SearchResultsPage => flow(
  performAllSearches(ports),
  TE.map(selectSubsetToDisplay(10)),
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
