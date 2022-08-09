import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
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
  renderErrorPage, RenderPage, renderPage, renderSearchResultsHeader,
} from './render-page';
import { selectSubsetToDisplay } from './select-subset-to-display';
import { searchPage } from '../search-page';
import { FindVersionsForArticleDoi, getLatestArticleVersionDate } from '../shared-components/article-card';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type Ports = PerformAllSearchesPorts & {
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getAllEvents: FetchExtraDetailsPorts['getAllEvents'],
  getListsOwnedBy: FetchExtraDetailsPorts['getListsOwnedBy'],
};

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

type PageAsPartials = {
  title: T.Task<string>,
  first: T.Task<HtmlFragment>,
  second: T.Task<HtmlFragment>,
};

type SearchResultsPageAsPartials = (ports: Ports) => (params: unknown) => PageAsPartials;

export const searchResultsPageAsPartials: SearchResultsPageAsPartials = (ports) => (combinedContext) => ({
  title: pipe(
    combinedContext,
    searchResultsPageParams.decode,
    E.map((p) => ({
      ...p,
      evaluatedOnly: O.isSome(p.evaluatedOnly),
    })),
    (foo) => foo,
    E.map(renderSearchResultsHeader),
    E.map((page) => page.title),
    E.getOrElse(() => ''),
    T.of,
  ),
  first: pipe(
    combinedContext,
    searchResultsPageParams.decode,
    E.map((p) => ({
      ...p,
      evaluatedOnly: O.isSome(p.evaluatedOnly),
    })),
    (foo) => foo,
    E.map(renderSearchResultsHeader),
    E.map((page) => page.content),
    E.getOrElse(() => ''),
    toHtmlFragment,
    T.of,
  ),
  second: pipe(
    combinedContext,
    searchResultsPageParams.decode,
    E.fold(
      () => TE.right(searchPage),
      searchResultsPage(ports)(20),
    ),
    TE.bimap(
      (err) => err.message,
      (page) => page.content,
    ),
    TE.toUnion,
  ),
});
