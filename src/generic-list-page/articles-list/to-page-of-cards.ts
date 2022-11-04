import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, identity, pipe } from 'fp-ts/function';
import { renderComponent } from './render-component';
import { noArticlesCanBeFetchedMessage } from './static-messages';
import { toCardViewModel, Ports as ToCardViewModelPorts } from './to-card-view-model';
import { ArticleViewModel } from '../../shared-components/article-card';
import { PageOfItems } from '../../shared-components/paginate';
import { paginationControls } from '../../shared-components/pagination-controls';
import { ArticleActivity } from '../../types/article-activity';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
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

const addArticleControls = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  listOwnerId: ListOwnerId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loggedInUserId: O.Option<UserId>,
) => (articleViewModel: ArticleViewModel) => ({
  articleViewModel,
  controls: O.none,
});

export const toPageOfCards = (
  ports: Ports,
  basePath: string,
  listOwnerId: ListOwnerId,
  loggedInUserId: O.Option<UserId>,
) => (pageOfArticles: PageOfItems<ArticleActivity>): T.Task<HtmlFragment> => pipe(
  pageOfArticles.items,
  T.traverseArray(toCardViewModel(ports)),
  T.map(E.fromPredicate(RA.some(E.isRight), () => noArticlesCanBeFetchedMessage)),
  TE.map(RA.map(E.bimap(
    identity,
    addArticleControls(listOwnerId, loggedInUserId),
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
