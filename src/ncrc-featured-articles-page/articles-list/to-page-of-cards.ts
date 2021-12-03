import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { toCardViewModel, Ports as ToCardViewModelPorts } from './to-card-view-model';
import { renderComponent } from '../../list-page/evaluated-articles-list/render-component';
import { noArticlesCanBeFetchedMessage } from '../../list-page/evaluated-articles-list/static-messages';
import { PageOfItems } from '../../shared-components/paginate';
import { paginationControls } from '../../shared-components/pagination-controls';
import { ArticleActivity } from '../../types/article-activity';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export type Ports = ToCardViewModelPorts;

const addPaginationControls = (nextPageNumber: O.Option<number>, listId: string) => flow(
  (pageOfContent: HtmlFragment) => `
    <div>
      ${pageOfContent}
      ${paginationControls(`/lists/${listId}?`, nextPageNumber)}
    </div>
  `,
  toHtmlFragment,
);

const renderPageNumbers = (page: number, articleCount: number, numberOfPages: number) => (
  articleCount > 0
    ? `<p class="evaluated-articles__page_count">
        Showing page ${page} of ${numberOfPages}<span class="visually-hidden"> pages of list content</span>
      </p>`
    : ''
);

export const toPageOfCards = (
  ports: Ports,
  listId: string,
) => (pageOfArticles: PageOfItems<ArticleActivity>): T.Task<HtmlFragment> => pipe(
  pageOfArticles.items,
  T.traverseArray(toCardViewModel(ports)),
  T.map(E.fromPredicate(RA.some(E.isRight), () => noArticlesCanBeFetchedMessage)),
  TE.map(flow(
    renderComponent,
    addPaginationControls(pageOfArticles.nextPage, listId),
    (content) => `
      ${renderPageNumbers(pageOfArticles.pageNumber, pageOfArticles.numberOfOriginalItems, pageOfArticles.numberOfPages)}
      ${content}
    `,
    toHtmlFragment,
  )),
  TE.toUnion,
);
