import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  fetchExtraDetails,
  Ports as FetchExtraDetailsPorts,
} from './fetch-extra-details';
import { Params, performAllSearches, Ports as PerformAllSearchesPorts } from './perform-all-searches';
import { renderAsHtml } from './render-as-html/render-as-html';
import { selectSubsetToDisplay } from './select-subset-to-display';
import { Ports as GetArticleVersionDatePorts, getLatestArticleVersionDate } from '../../shared-components/article-card';
import { RenderPageError } from '../../types/render-page-error';
import { Page } from '../../types/page';
import { renderErrorPage } from './render-as-html/render-error-page';

// ts-unused-exports:disable-next-line
export type Ports = PerformAllSearchesPorts
// The next two lines are necessary as getLatestVersionDate is not in CollectedPorts and is constructed locally
& Omit<FetchExtraDetailsPorts, 'getLatestArticleVersionDate'>
& GetArticleVersionDatePorts;

type SearchResultsPage = (
  ports: Ports,
) => (pageSize: number) => (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const searchResultsPage: SearchResultsPage = (ports) => (pageSize) => (params) => pipe(
  params,
  performAllSearches(ports)(pageSize),
  TE.map(selectSubsetToDisplay),
  TE.chainTaskK(fetchExtraDetails({
    ...ports,
    getLatestArticleVersionDate: getLatestArticleVersionDate(ports),
  })),
  TE.bimap(renderErrorPage, renderAsHtml),
);
