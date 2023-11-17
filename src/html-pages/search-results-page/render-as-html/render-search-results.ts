import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { wrapWithPaginationInformation } from './wrap-with-pagination-information.js';
import { renderSearchResultsList } from './render-search-results-list.js';
import { renderArticleCard } from '../../../shared-components/article-card/index.js';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment.js';
import { ViewModel } from '../view-model.js';

export const renderSearchResults = (viewModel: ViewModel): HtmlFragment => pipe(
  viewModel.articleCards,
  RA.map(renderArticleCard),
  renderSearchResultsList,
  wrapWithPaginationInformation(viewModel),
  toHtmlFragment,
);
