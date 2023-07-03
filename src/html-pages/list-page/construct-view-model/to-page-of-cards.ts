import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  ArticleCardWithControlsAndAnnotationViewModel,
  constructArticleCardWithControlsAndAnnotationViewModel,
  ArticleErrorCardViewModel,
} from '../../../shared-components/article-card';
import { PageOfItems } from '../../../shared-components/paginate';
import { ArticleActivity } from '../../../types/article-activity';
import { ListId } from '../../../types/list-id';
import { Dependencies } from './dependencies';
import { ContentWithPaginationViewModel } from '../view-model';

export const toPageOfCards = (
  dependencies: Dependencies,
  editCapability: boolean,
  listId: ListId,
) => (
  pageOfArticles: PageOfItems<ArticleActivity>,
): TE.TaskEither<'no-articles-can-be-fetched', ContentWithPaginationViewModel['articles']> => pipe(
  pageOfArticles.items,
  RA.map((item) => item.articleId),
  T.traverseArray(constructArticleCardWithControlsAndAnnotationViewModel(dependencies, editCapability, listId)),
  T.map(E.fromPredicate(RA.some(E.isRight), () => 'no-articles-can-be-fetched' as const)),
  TE.chainTaskK(T.traverseArray(
    E.foldW(
      TE.left,
      TE.right<ArticleErrorCardViewModel, ArticleCardWithControlsAndAnnotationViewModel>,
    ),
  )),
);
