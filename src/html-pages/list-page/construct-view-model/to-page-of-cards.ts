import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { toCardViewModel, Ports as ToCardViewModelPorts } from './to-card-view-model';
import { ArticleViewModel } from '../../../shared-components/article-card';
import { PageOfItems } from '../../../shared-components/paginate';
import { GetAllEvents, GetAnnotationContent } from '../../../shared-ports';
import { ArticleActivity } from '../../../types/article-activity';
import { ArticleCardWithControlsViewModel, ArticlesViewModel } from '../view-model';
import { ArticleErrorCardViewModel } from '../render-as-html/render-article-error-card';
import { ListId } from '../../../types/list-id';

export type Ports = ToCardViewModelPorts & {
  getAllEvents: GetAllEvents,
  getAnnotationContent: GetAnnotationContent,
};

const toArticleCardWithControlsViewModel = (
  ports: Ports,
  editCapability: boolean,
  listId: ListId,
) => (articleViewModel: ArticleViewModel) => pipe(
  {
    articleViewModel: T.of(articleViewModel),
    annotationContent: pipe(
      ports.getAnnotationContent(listId, articleViewModel.articleId),
      T.of,
    ),
    controls: pipe(
      editCapability,
      T.of,
    ),
  },
  sequenceS(T.ApplyPar),
);

export const toPageOfCards = (
  ports: Ports,
  editCapability: boolean,
  listId: ListId,
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
        toArticleCardWithControlsViewModel(ports, editCapability, listId),
        T.map((card) => E.right<ArticleErrorCardViewModel, ArticleCardWithControlsViewModel>(card)),
      ),
    ),
  )),
);
