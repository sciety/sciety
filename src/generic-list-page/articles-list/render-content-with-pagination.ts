import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import { ArticleErrorCardViewModel } from './render-article-error-card';
import { ArticleCardWithControlsViewModel, renderArticlesList } from './render-articles-list';
import { PageOfItems } from '../../shared-components/paginate';
import { paginationControls } from '../../shared-components/pagination-controls';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

const addPaginationControls = (nextPageNumber: O.Option<number>, basePath: string) => flow(
  (pageOfContent: HtmlFragment) => `
    <div>
      ${pageOfContent}
      ${paginationControls(`${basePath}?`, nextPageNumber)}
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

export type ArticleCardViewModel = E.Either<ArticleErrorCardViewModel, ArticleCardWithControlsViewModel>;

export const renderContentWithPagination = (
  basePath: string,
) => (
  viewModel: PageOfItems<ArticleCardViewModel>,
): HtmlFragment => pipe(
  viewModel.items,
  renderArticlesList,
  addPaginationControls(viewModel.nextPage, basePath),
  (content) => `
      ${renderPageNumbers(viewModel.pageNumber, viewModel.numberOfOriginalItems, viewModel.numberOfPages)}
      ${content}
    `,
  toHtmlFragment,
);
