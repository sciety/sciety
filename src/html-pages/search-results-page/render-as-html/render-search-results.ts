import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { pageTabs } from './page-tabs';
import { pagination } from './pagination';
import { renderSearchResultsList } from './render-search-results-list';
import { renderArticleCard } from '../../../shared-components/article-card';
import { renderGroupCard } from '../../../shared-components/group-card';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { isArticleViewModel, ItemViewModel, ViewModel } from '../view-model';

const renderSearchResult = (viewModel: ItemViewModel) => (
  isArticleViewModel(viewModel) ? renderArticleCard(viewModel) : renderGroupCard(viewModel)
);

export const renderSearchResults = (viewModel: ViewModel): HtmlFragment => pipe(
  viewModel.itemsToDisplay,
  RA.map(renderSearchResult),
  renderSearchResultsList,
  pagination(viewModel),
  pageTabs(viewModel),
  toHtmlFragment,
);
