import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  fetchExtraDetails,
  Ports as FetchExtraDetailsPorts,
} from './fetch-extra-details';
import {
  Params, performAllSearches, Ports as PerformAllSearchesPorts,
} from './perform-all-searches';
import {
  renderErrorPage, renderPage,
} from './render-partials';
import { selectSubsetToDisplay } from './select-subset-to-display';
import { FindVersionsForArticleDoi, getLatestArticleVersionDate } from '../shared-components/article-card';
import { HtmlFragment } from '../types/html-fragment';

export type Ports = PerformAllSearchesPorts & {
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getAllEvents: FetchExtraDetailsPorts['getAllEvents'],
  getListsOwnedBy: FetchExtraDetailsPorts['getListsOwnedBy'],
};

type SearchResults = (ports: Ports) => (pageSize: number) => (params: Params) => T.Task<HtmlFragment>;

export const searchResults: SearchResults = (ports) => (pageSize) => (params) => pipe(
  params,
  performAllSearches(ports)(pageSize),
  TE.map(selectSubsetToDisplay),
  TE.chainTaskK(fetchExtraDetails({
    ...ports,
    getLatestArticleVersionDate: getLatestArticleVersionDate(ports.findVersionsForArticleDoi),
  })),
  TE.match(() => renderErrorPage, renderPage),
);
