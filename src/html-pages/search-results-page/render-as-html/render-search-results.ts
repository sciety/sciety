import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { wrapWithPaginationInformation } from './wrap-with-pagination-information.js';
import { renderSearchResultsList } from './render-search-results-list.js';
import { renderPaperActivitySummaryCard } from '../../../shared-components/paper-activity-summary-card/index.js';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment.js';
import { ViewModel } from '../view-model.js';

export const renderSearchResults = (viewModel: ViewModel): HtmlFragment => pipe(
  viewModel.paperActivitySummaryCards,
  RA.map(renderPaperActivitySummaryCard),
  renderSearchResultsList,
  wrapWithPaginationInformation(viewModel),
  toHtmlFragment,
);
