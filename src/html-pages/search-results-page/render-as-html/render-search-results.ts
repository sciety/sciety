import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { wrapWithPaginationInformation } from './wrap-with-pagination-information';
import { renderSearchResultsList } from './render-search-results-list';
import { renderArticleCard } from '../../../shared-components/paper-activity-summary-card';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ViewModel } from '../view-model';

export const renderSearchResults = (viewModel: ViewModel): HtmlFragment => pipe(
  viewModel.paperActivitySummaryCards,
  RA.map(renderArticleCard),
  renderSearchResultsList,
  wrapWithPaginationInformation(viewModel),
  toHtmlFragment,
);
