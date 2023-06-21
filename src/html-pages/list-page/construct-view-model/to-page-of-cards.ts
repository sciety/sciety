import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { ArticleCardViewModel } from '../../../shared-components/article-card';
import {
  populateArticleViewModel,
  Ports as PopulateArticleViewModelPorts,
} from '../../../shared-components/article-card/populate-article-view-model';
import { PageOfItems } from '../../../shared-components/paginate';
import { ArticleActivity } from '../../../types/article-activity';
import { ArticleCardWithControlsViewModel, ArticlesViewModel } from '../view-model';
import { ArticleErrorCardViewModel } from '../render-as-html/render-article-error-card';
import { ListId } from '../../../types/list-id';
import { Queries } from '../../../shared-read-models';

export type Ports = PopulateArticleViewModelPorts & Queries;

const toArticleCardWithControlsViewModel = (
  ports: Ports,
  editCapability: boolean,
  listId: ListId,
) => (articleViewModel: ArticleCardViewModel) => pipe(
  {
    articleViewModel,
    annotationContent: ports.getAnnotationContent(listId, articleViewModel.articleId),
    controls: editCapability,
  },
);

export const toPageOfCards = (
  ports: Ports,
  editCapability: boolean,
  listId: ListId,
) => (
  pageOfArticles: PageOfItems<ArticleActivity>,
): TE.TaskEither<'no-articles-can-be-fetched', ArticlesViewModel> => pipe(
  pageOfArticles.items,
  T.traverseArray(({ articleId }) => populateArticleViewModel(ports)(articleId)),
  T.map(E.fromPredicate(RA.some(E.isRight), () => 'no-articles-can-be-fetched' as const)),
  TE.chainTaskK(T.traverseArray(
    E.foldW(
      TE.left,
      flow(
        toArticleCardWithControlsViewModel(ports, editCapability, listId),
        (card) => TE.right<ArticleErrorCardViewModel, ArticleCardWithControlsViewModel>(card),
      ),
    ),
  )),
);
