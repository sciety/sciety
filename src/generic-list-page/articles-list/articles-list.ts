import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { populateArticleActivities } from './populate-article-activities';
import { ArticleErrorCardViewModel } from './render-article-error-card';
import { ArticleCardWithControlsViewModel, renderComponent } from './render-component';
import { noArticlesMessage } from './static-messages';
import { toPageOfCards, Ports as ToPageOfCardsPorts } from './to-page-of-cards';
import { DomainEvent } from '../../domain-events';
import { PageOfItems, paginate } from '../../shared-components/paginate';
import { paginationControls } from '../../shared-components/pagination-controls';
import { selectArticlesBelongingToList } from '../../shared-read-models/list-articles';
import * as DE from '../../types/data-error';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';
import { ListOwnerId } from '../../types/list-owner-id';
import { UserId } from '../../types/user-id';

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

const renderComponentWithPagination = (
  pageOfArticles: PageOfItems<unknown>,
  basePath: string,
) => (articleViewModels: ReadonlyArray<E.Either<ArticleErrorCardViewModel, ArticleCardWithControlsViewModel>>) => pipe(
  articleViewModels,
  renderComponent,
  addPaginationControls(pageOfArticles.nextPage, basePath),
  (content) => `
      ${renderPageNumbers(pageOfArticles.pageNumber, pageOfArticles.numberOfOriginalItems, pageOfArticles.numberOfPages)}
      ${content}
    `,
  toHtmlFragment,
);

export type Ports = ToPageOfCardsPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

export const articlesList = (
  ports: Ports,
  listId: ListId,
  pageNumber: number,
  loggedInUserId: O.Option<UserId>,
  listOwnerId: ListOwnerId,
): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  ports.getAllEvents,
  T.map(selectArticlesBelongingToList(listId)),
  TE.chain(RA.match(
    () => TE.right(noArticlesMessage),
    flow(
      paginate(20, pageNumber),
      TE.fromEither,
      TE.chainTaskK(populateArticleActivities(ports)),
      TE.chainTaskK((pageOfArticles) => pipe(
        pageOfArticles,
        toPageOfCards(ports,
          `/lists/${listId}`,
          listOwnerId,
          loggedInUserId,
          listId),
        TE.map(renderComponentWithPagination(pageOfArticles, `/lists/${listId}`)),
        TE.toUnion,
      )),
    ),
  )),
);
