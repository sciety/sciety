import { flow, pipe } from 'fp-ts/function';
import { renderArticlesList } from './render-articles-list';
import { LegacyPaginationControlsViewModel, renderLegacyPaginationControls } from '../../../../html-pages/shared-components/pagination';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { ContentWithPaginationViewModel } from '../view-model';

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
