import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import { ArticleErrorCardViewModel } from './render-article-error-card';
import { ArticleCardWithControlsViewModel, renderComponent } from './render-component';
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

export type ComponentWithPaginationViewModel = ReadonlyArray<E.Either<
ArticleErrorCardViewModel,
ArticleCardWithControlsViewModel
>>;

export const renderComponentWithPagination = (
  pageOfArticles: PageOfItems<unknown>,
  basePath: string,
) => (
  articleViewModels: ComponentWithPaginationViewModel,
): HtmlFragment => pipe(
  articleViewModels,
  renderComponent,
  addPaginationControls(pageOfArticles.nextPage, basePath),
  (content) => `
      ${renderPageNumbers(pageOfArticles.pageNumber, pageOfArticles.numberOfOriginalItems, pageOfArticles.numberOfPages)}
      ${content}
    `,
  toHtmlFragment,
);
