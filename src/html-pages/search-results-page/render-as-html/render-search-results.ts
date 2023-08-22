import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { applyTabControls } from './apply-tab-controls';
import { wrapWithPaginationInformation } from './wrap-with-pagination-information';
import { renderSearchResultsList } from './render-search-results-list';
import { renderArticleCard } from '../../../shared-components/article-card';
import { renderGroupCard } from '../../../shared-components/group-card';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { isArticleViewModel, ItemCardViewModel, ViewModel } from '../view-model';

const renderSearchResult = (viewModel: ItemCardViewModel) => (
  isArticleViewModel(viewModel) ? renderArticleCard(viewModel) : renderGroupCard(viewModel)
);

export const renderSearchResults = (viewModel: ViewModel): HtmlFragment => pipe(
  viewModel.itemsToDisplay,
  RA.map(renderSearchResult),
  renderSearchResultsList,
  wrapWithPaginationInformation(viewModel),
  applyTabControls(viewModel),
  toHtmlFragment,
);
