import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import { renderArticlesList } from './render-articles-list';
import { PaginationControlsViewModel, renderPaginationControls } from '../../../shared-components/pagination';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ContentWithPaginationViewModel } from '../view-model';

const constructPaginationControlsViewModel = (nextPageNumber: O.Option<number>, basePath: string) => ({
  nextPageHref: pipe(
    nextPageNumber,
    O.map(
      (nextPage) => `${basePath}?page=${nextPage}`,
    ),
  ),
});

const addPaginationControls = (paginationControlsViewModel: PaginationControlsViewModel) => flow(
  (pageOfContent: HtmlFragment) => `
    <div>
      ${pageOfContent}
      ${renderPaginationControls(paginationControlsViewModel)}
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
  addPaginationControls(constructPaginationControlsViewModel(viewModel.pagination.nextPage, basePath)),
  (content) => `
      ${renderPageNumbers(viewModel.pagination.pageNumber, viewModel.pagination.numberOfOriginalItems, viewModel.pagination.numberOfPages)}
      ${content}
    `,
  toHtmlFragment,
);
