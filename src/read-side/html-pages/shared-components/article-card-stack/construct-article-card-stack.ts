import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { ExpressionDoi } from '../../../../types/expression-doi';
import { DependenciesForViews } from '../../../dependencies-for-views';
import { ArticleCardViewModel, ArticleErrorCardViewModel, constructArticleCard } from '../article-card';

export const constructArticleCardStack = (
  dependencies: DependenciesForViews,
) => (
  expressionDois: ReadonlyArray<ExpressionDoi>,
): T.Task<ReadonlyArray<E.Either<ArticleErrorCardViewModel, ArticleCardViewModel>>> => pipe(
  expressionDois,
  T.traverseArray(constructArticleCard(dependencies)),
);
