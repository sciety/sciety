import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { PaperActivityErrorCardViewModel } from '../../../shared-components/paper-activity-summary-card';
import {
  ArticleCardWithControlsAndAnnotationViewModel,
  constructArticleCardWithControlsAndAnnotation,
} from '../../../shared-components/article-card-with-controls-and-annotation';
import { PageOfItems } from '../../../shared-components/pagination';
import { ListId } from '../../../types/list-id';
import { Dependencies } from './dependencies';
import { ContentWithPaginationViewModel } from '../view-model';
import { ExpressionDoi } from '../../../types/expression-doi';

export const toPageOfCards = (
  dependencies: Dependencies,
  editCapability: boolean,
  listId: ListId,
) => (
  pageOfArticles: PageOfItems<ExpressionDoi>,
): TE.TaskEither<'no-articles-can-be-fetched', ContentWithPaginationViewModel['articles']> => pipe(
  pageOfArticles.items,
  T.traverseArray(constructArticleCardWithControlsAndAnnotation(dependencies, editCapability, listId)),
  T.map(E.fromPredicate(RA.some(E.isRight), () => 'no-articles-can-be-fetched' as const)),
  TE.chainTaskK(T.traverseArray(
    E.foldW(
      TE.left,
      TE.right<PaperActivityErrorCardViewModel, ArticleCardWithControlsAndAnnotationViewModel>,
    ),
  )),
);
