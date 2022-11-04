import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as B from 'fp-ts/boolean';
import { flow, identity, pipe } from 'fp-ts/function';
import { renderComponent } from './render-component';
import { noArticlesCanBeFetchedMessage } from './static-messages';
import { toCardViewModel, Ports as ToCardViewModelPorts } from './to-card-view-model';
import { ArticleViewModel } from '../../shared-components/article-card';
import { PageOfItems } from '../../shared-components/paginate';
import { paginationControls } from '../../shared-components/pagination-controls';
import { ArticleActivity } from '../../types/article-activity';
import { Doi } from '../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';
import { ListOwnerId } from '../../types/list-owner-id';
import { UserId } from '../../types/user-id';

export type Ports = ToCardViewModelPorts;

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

const articleControls = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  listOwnerId: ListOwnerId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loggedInUserId: O.Option<UserId>,
) => false;

const renderRemoveArticleForm = (articleId: Doi, listId: ListId) => pipe(
  articleId.value,
  (id) => `<form method="post" action="/remove-article-from-list-from-form">
      <input type="hidden" name="articleid" value="${id}">
      <input type="hidden" name="listid" value="${listId}">
      <button aria-label="Remove this article from the list" class="saved-articles-control">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" class="saved-articles-control__icon">
          <desc>Remove this article from the list</desc>
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
        </svg>
      </button>
    </form>`,
  toHtmlFragment,
);

const toArticleCardWithControlsViewModel = (
  listOwnerId: ListOwnerId,
  loggedInUserId: O.Option<UserId>,
  listId: ListId,
) => (articleViewModel: ArticleViewModel) => ({
  articleViewModel,
  controls: pipe(
    articleControls(listOwnerId, loggedInUserId),
    B.fold(
      () => O.none,
      () => O.some(renderRemoveArticleForm(articleViewModel.articleId, listId)),
    ),
  ),
});

export const toPageOfCards = (
  ports: Ports,
  basePath: string,
  listOwnerId: ListOwnerId,
  loggedInUserId: O.Option<UserId>,
  listId: ListId,
) => (pageOfArticles: PageOfItems<ArticleActivity>): T.Task<HtmlFragment> => pipe(
  pageOfArticles.items,
  T.traverseArray(toCardViewModel(ports)),
  T.map(E.fromPredicate(RA.some(E.isRight), () => noArticlesCanBeFetchedMessage)),
  TE.map(RA.map(E.bimap(
    identity,
    toArticleCardWithControlsViewModel(listOwnerId, loggedInUserId, listId),
  ))),
  TE.map(flow(
    renderComponent,
    addPaginationControls(pageOfArticles.nextPage, basePath),
    (content) => `
      ${renderPageNumbers(pageOfArticles.pageNumber, pageOfArticles.numberOfOriginalItems, pageOfArticles.numberOfPages)}
      ${content}
    `,
    toHtmlFragment,
  )),
  TE.toUnion,
);
