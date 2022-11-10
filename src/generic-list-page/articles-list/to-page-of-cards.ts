import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as B from 'fp-ts/boolean';
import { flow, pipe } from 'fp-ts/function';
import { ArticleErrorCardViewModel } from './render-article-error-card';
import { ArticleCardWithControlsViewModel } from './render-component';
import { ArticlesViewModel } from './render-component-with-pagination';
import { toCardViewModel, Ports as ToCardViewModelPorts } from './to-card-view-model';
import { ArticleViewModel } from '../../shared-components/article-card';
import { PageOfItems } from '../../shared-components/paginate';
import { GetAllEvents } from '../../shared-ports';
import { getAnnotationContentByUserListTarget } from '../../shared-read-models/annotations';
import { ArticleActivity } from '../../types/article-activity';
import { Doi } from '../../types/doi';
import { toHtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';
import { ListOwnerId } from '../../types/list-owner-id';
import * as UID from '../../types/user-id';

export type Ports = ToCardViewModelPorts & { getAllEvents: GetAllEvents };

const renderRemoveArticleForm = (articleId: Doi, listId: ListId) => pipe(
  articleId.value,
  (id) => `<form method="post" action="/forms/remove-article-from-list">
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
  ports: Ports,
  hasArticleControls: boolean,
  listId: ListId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  listOwnerId: ListOwnerId,
) => (articleViewModel: ArticleViewModel) => pipe(
  {
    articleViewModel: T.of(articleViewModel),
    annotationContent: pipe(
      ports.getAllEvents,
      T.map(getAnnotationContentByUserListTarget(articleViewModel.articleId, UID.fromValidatedString('123456'))),
    ),
    controls: pipe(
      hasArticleControls,
      B.fold(
        () => O.none,
        () => O.some(renderRemoveArticleForm(articleViewModel.articleId, listId)),
      ),
      T.of,
    ),
  },
  sequenceS(T.ApplyPar),
);

export const toPageOfCards = (
  ports: Ports,
  hasArticleControls: boolean,
  listId: ListId,
  listOwnerId: ListOwnerId,
) => (
  pageOfArticles: PageOfItems<ArticleActivity>,
): TE.TaskEither<'no-articles-can-be-fetched', ArticlesViewModel> => pipe(
  pageOfArticles.items,
  T.traverseArray(toCardViewModel(ports)),
  T.map(E.fromPredicate(RA.some(E.isRight), () => 'no-articles-can-be-fetched' as const)),
  TE.chainTaskK(T.traverseArray(
    E.foldW(
      TE.left,
      flow(
        toArticleCardWithControlsViewModel(ports, hasArticleControls, listId, listOwnerId),
        T.map((card) => E.right<ArticleErrorCardViewModel, ArticleCardWithControlsViewModel>(card)),
      ),
    ),
  )),
);
