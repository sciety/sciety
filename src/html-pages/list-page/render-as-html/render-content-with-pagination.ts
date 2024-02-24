import { flow, pipe } from 'fp-ts/function';
import { renderArticlesList } from './render-articles-list.js';
import { LegacyPaginationControlsViewModel, renderLegacyPaginationControls } from '../../../shared-components/pagination/index.js';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment.js';
import { ContentWithPaginationViewModel } from '../view-model.js';

const addPaginationControls = (paginationControlsViewModel: LegacyPaginationControlsViewModel) => flow(
  (pageOfContent: HtmlFragment) => `
    <div>
      ${pageOfContent}
      ${renderLegacyPaginationControls(paginationControlsViewModel)}
    </div>
  `,
  toHtmlFragment,
);

const renderPageNumbers = (page: number, articleCount: number, numberOfPages: number) => (
  articleCount > 0
    ? `<p class="articles-page-count">
        Showing page <b>${page}</b> of <b>${numberOfPages}</b><span class="visually-hidden"> pages of list content</span>
      </p>`
    : ''
);

export const renderContentWithPagination = (
  basePath: string,
  viewModel: ContentWithPaginationViewModel,
): HtmlFragment => pipe(
  viewModel.articles,
  renderArticlesList,
  addPaginationControls(viewModel),
  (content) => `
      ${renderPageNumbers(viewModel.pagination.pageNumber, viewModel.pagination.numberOfOriginalItems, viewModel.pagination.numberOfPages)}
      ${content}
    `,
  toHtmlFragment,
);
