import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ArticleErrorCardViewModel } from '../../../shared-components/article-card/index.js';
import {
  ArticleCardWithControlsAndAnnotationViewModel,
  constructArticleCardWithControlsAndAnnotation,
} from '../../../shared-components/article-card-with-controls-and-annotation/index.js';
import { PageOfItems } from '../../../shared-components/pagination/index.js';
import { ListId } from '../../../types/list-id.js';
import { Dependencies } from './dependencies.js';
import { ContentWithPaginationViewModel } from '../view-model.js';
import { ArticleId } from '../../../types/article-id.js';

export const toPageOfCards = (
  dependencies: Dependencies,
  editCapability: boolean,
  listId: ListId,
) => (
  pageOfArticles: PageOfItems<ArticleId>,
): TE.TaskEither<'no-articles-can-be-fetched', ContentWithPaginationViewModel['articles']> => pipe(
  pageOfArticles.items,
  T.traverseArray(constructArticleCardWithControlsAndAnnotation(dependencies, editCapability, listId)),
  T.map(E.fromPredicate(RA.some(E.isRight), () => 'no-articles-can-be-fetched' as const)),
  TE.chainTaskK(T.traverseArray(
    E.foldW(
      TE.left,
      TE.right<ArticleErrorCardViewModel, ArticleCardWithControlsAndAnnotationViewModel>,
    ),
  )),
);
