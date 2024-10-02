import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ExpressionDoi } from '../../../../types/expression-doi';
import { DependenciesForViews } from '../../../dependencies-for-views';
import { ArticleCardViewModel, constructArticleCard } from '../article-card';

export const constructArticleCardStackWithTotalFailure = (
  dependencies: DependenciesForViews,
) => (
  expressionDois: ReadonlyArray<ExpressionDoi>,
): TE.TaskEither<unknown, ReadonlyArray<ArticleCardViewModel>> => pipe(
  expressionDois,
  TE.traverseArray(constructArticleCard(dependencies)),
);
