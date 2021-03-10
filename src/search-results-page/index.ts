import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FindReviewsForArticleDoi, projectArticleMeta } from './project-article-meta';
import { projectGroupMeta } from './project-group-meta';
import { renderErrorPage, RenderPage, renderPage } from './render-page';
import { ArticleSearchResult, renderSearchResult } from './render-search-result';
import { renderSearchResults } from './render-search-results';
import {
  FetchStaticFile,
  GetAllEvents, GetGroup, search,
} from './search';

type OriginalSearchResults = {
  items: ReadonlyArray<Omit<Omit<ArticleSearchResult, '_tag'>, 'reviewCount'>>,
  total: number,
};

type FindArticles = (query: string) => TE.TaskEither<'unavailable', OriginalSearchResults>;

type Ports = {
  searchEuropePmc: FindArticles,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  getGroup: GetGroup,
  getAllEvents: GetAllEvents,
  fetchStaticFile: FetchStaticFile,
};

type Params = {
  query?: string,
};

type SearchResultsPage = (params: Params) => ReturnType<RenderPage>;

export const searchResultsPage = (ports: Ports): SearchResultsPage => (params) => pipe(
  ports.getAllEvents,
  TE.rightTask,
  TE.chain((events) => search(
    ports.searchEuropePmc,
    ports.getGroup,
    ports.fetchStaticFile,
    projectArticleMeta(ports.findReviewsForArticleDoi),
    projectGroupMeta(events),
  )(params.query ?? '')),
  TE.map(renderSearchResults(renderSearchResult)),
  TE.bimap(renderErrorPage, renderPage),
);
