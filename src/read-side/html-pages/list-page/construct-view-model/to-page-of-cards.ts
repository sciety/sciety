import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ExpressionDoi } from '../../../../types/expression-doi';
import { ListId } from '../../../../types/list-id';
import { DependenciesForViews } from '../../../dependencies-for-views';
import { ArticleErrorCardViewModel } from '../../shared-components/article-card';
import {
  ArticleCardWithControlsAndAnnotationViewModel,
  constructArticleCardWithControlsAndAnnotation,
} from '../../shared-components/article-card-with-controls-and-annotation';
import { PageOfItems } from '../../shared-components/pagination';
import { ContentWithPaginationViewModel } from '../view-model';

export const toPageOfCards = (
  dependencies: DependenciesForViews,
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
      TE.right<ArticleErrorCardViewModel, ArticleCardWithControlsAndAnnotationViewModel>,
    ),
  )),
);
