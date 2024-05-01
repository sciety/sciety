import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { renderSearchResultsList } from './render-search-results-list';
import { wrapWithPaginationInformation } from './wrap-with-pagination-information';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderPaperActivitySummaryCard } from '../../shared-components/paper-activity-summary-card';
import { ViewModel } from '../view-model';

export const renderSearchResults = (viewModel: ViewModel): HtmlFragment => pipe(
  viewModel.paperActivitySummaryCards,
  RA.map(renderPaperActivitySummaryCard),
  renderSearchResultsList,
  wrapWithPaginationInformation(viewModel),
  toHtmlFragment,
);