import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  fetchExtraDetails,
  Ports as FetchExtraDetailsPorts,
} from './fetch-extra-details';
import { Params, performAllSearches, Ports as PerformAllSearchesPorts } from './perform-all-searches';
import { renderErrorPage, RenderPage, renderPage } from './render-page';
import { SearchResults } from './render-search-results';
import { selectSubsetToDisplay } from './select-subset-to-display';
import { FindVersionsForArticleDoi, getLatestArticleVersionDate } from '../shared-components/article-card';
import * as DE from '../types/data-error';

type Ports = PerformAllSearchesPorts & {
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getAllEvents: FetchExtraDetailsPorts['getAllEvents'],
  getListsOwnedBy: FetchExtraDetailsPorts['getListsOwnedBy'],
};

export const generateSearchResults = (
  ports: Ports,
) => (pageSize: number) => (params: Params): TE.TaskEither<DE.DataError, SearchResults> => pipe(
  params,
  performAllSearches(ports)(pageSize),
  TE.map(selectSubsetToDisplay),
  TE.chainTaskK(fetchExtraDetails({
    ...ports,
    getLatestArticleVersionDate: getLatestArticleVersionDate(ports.findVersionsForArticleDoi),
  })),
);

type SearchResultsPage = (ports: Ports) => (pageSize: number) => (params: Params) => ReturnType<RenderPage>;

export const searchResultsPage: SearchResultsPage = (ports) => (pageSize) => (params) => pipe(
  params,
  performAllSearches(ports)(pageSize),
  TE.map(selectSubsetToDisplay),
  TE.chainTaskK(fetchExtraDetails({
    ...ports,
    getLatestArticleVersionDate: getLatestArticleVersionDate(ports.findVersionsForArticleDoi),
  })),
  TE.bimap(renderErrorPage, renderPage),
);
