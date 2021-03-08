import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderErrorPage, RenderPage, renderPage } from './render-page';
import { ArticleSearchResult, renderSearchResult } from './render-search-result';
import { renderSearchResults } from './render-search-results';
import {
  FindReviewsForArticleDoi, GetAllEvents, GetGroup, search,
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
};

type Params = {
  query?: string,
};

type SearchResultsPage = (params: Params) => ReturnType<RenderPage>;

export const searchResultsPage = (ports: Ports): SearchResultsPage => (params) => pipe(
  params.query ?? '', // TODO: use Option
  search(ports.searchEuropePmc, ports.findReviewsForArticleDoi, ports.getGroup, ports.getAllEvents),
  TE.map(renderSearchResults(renderSearchResult)),
  TE.bimap(renderErrorPage, renderPage),
);
