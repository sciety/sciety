import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import { renderArticlesList } from './render-articles-list';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderLegacyPaginationControls } from '../../shared-components/pagination';
import { ContentWithPaginationViewModel } from '../view-model';

const addPaginationControls = (nextPageHref: ContentWithPaginationViewModel['nextPageHref']) => flow(
  (pageOfContent: HtmlFragment) => `
    <div>
      ${pageOfContent}
      ${pipe(
    nextPageHref,
    O.map(renderLegacyPaginationControls),
    O.getOrElse(() => ''),
  )}
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
  addPaginationControls(viewModel.nextPageHref),
  (content) => `
      ${renderPageNumbers(viewModel.pagination.pageNumber, viewModel.pagination.numberOfOriginalItems, viewModel.pagination.numberOfPages)}
      ${content}
    `,
  toHtmlFragment,
);
