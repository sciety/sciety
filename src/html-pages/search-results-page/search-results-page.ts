import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { performance } from 'perf_hooks';
import {
  fetchExtraDetails,
  Ports as FetchExtraDetailsPorts,
} from './fetch-extra-details';
import { Params, performAllSearches, Ports as PerformAllSearchesPorts } from './perform-all-searches';
import { renderErrorPage, RenderPage, renderPage } from './render-page';
import { selectSubsetToDisplay } from './select-subset-to-display';
import { FindVersionsForArticleDoi, getLatestArticleVersionDate } from '../../shared-components/article-card';

// ts-unused-exports:disable-next-line
export type Ports = PerformAllSearchesPorts
// The next two lines are necessary as getLatestVersionDate is not in CollectedPorts and is constructed locally
& Omit<FetchExtraDetailsPorts, 'getLatestArticleVersionDate'>
& { findVersionsForArticleDoi: FindVersionsForArticleDoi };

type SearchResultsPage = (ports: Ports) => (pageSize: number) => (params: Params) => ReturnType<RenderPage>;

export const searchResultsPage: SearchResultsPage = (ports) => (pageSize) => (params) => pipe(
  params,
  (input) => {
    console.log('before performAllSearches', performance.now());
    return input;
  },
  performAllSearches(ports)(pageSize),
  TE.map((input) => {
    console.log('before selectSubsetToDisplay', performance.now());
    return input;
  }),
  TE.map(selectSubsetToDisplay),
  TE.map((input) => {
    console.log('before fetchExtraDetails', performance.now());
    return input;
  }),
  TE.chainTaskK(fetchExtraDetails({
    ...ports,
    getLatestArticleVersionDate: getLatestArticleVersionDate(ports.findVersionsForArticleDoi),
  })),
  TE.map((input) => {
    console.log('before renderPage', performance.now());
    return input;
  }),
  TE.bimap(renderErrorPage, renderPage),
  TE.map((input) => {
    console.log('after renderPage', performance.now());
    return input;
  }),
);
