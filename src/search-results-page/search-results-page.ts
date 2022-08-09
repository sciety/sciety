import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  fetchExtraDetails,
  Ports as FetchExtraDetailsPorts,
} from './fetch-extra-details';
import {
  Params, performAllSearches, Ports as PerformAllSearchesPorts, paramsCodec as searchResultsPageParams,
} from './perform-all-searches';
import {
  renderErrorPage, renderPage, renderSearchResultsHeader, renderSearchResultsTitle,
} from './render-page';
import { selectSubsetToDisplay } from './select-subset-to-display';
import { searchPage } from '../search-page';
import { FindVersionsForArticleDoi, getLatestArticleVersionDate } from '../shared-components/article-card';
import { HtmlFragment } from '../types/html-fragment';
import { PageAsPartials } from '../types/page-as-partials';

type Ports = PerformAllSearchesPorts & {
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getAllEvents: FetchExtraDetailsPorts['getAllEvents'],
  getListsOwnedBy: FetchExtraDetailsPorts['getListsOwnedBy'],
};

type SearchResults = (ports: Ports) => (pageSize: number) => (params: Params) => T.Task<HtmlFragment>;

const searchResults: SearchResults = (ports) => (pageSize) => (params) => pipe(
  params,
  performAllSearches(ports)(pageSize),
  TE.map(selectSubsetToDisplay),
  TE.chainTaskK(fetchExtraDetails({
    ...ports,
    getLatestArticleVersionDate: getLatestArticleVersionDate(ports.findVersionsForArticleDoi),
  })),
  TE.match(() => renderErrorPage, renderPage),
);

type SearchResultsPageAsPartials = (ports: Ports) => (combinedContext: unknown) => PageAsPartials;

export const searchResultsPageAsPartials: SearchResultsPageAsPartials = (ports) => (combinedContext) => pipe(
  combinedContext,
  searchResultsPageParams.decode,
  E.fold(
    () => searchPage,
    (params) => ({
      title: pipe(
        params.query,
        renderSearchResultsTitle,
        T.of,
      ),
      first: pipe(
        params,
        renderSearchResultsHeader,
        T.of,
      ),
      second: pipe(
        params,
        searchResults(ports)(20),
      ),
    }),
  ),
);
