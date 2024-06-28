import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { ExpressionDoi } from '../../../../types/expression-doi';
import { DependenciesForViews } from '../../../dependencies-for-views';
import { ArticleCardViewModel, constructArticleCard } from '../article-card';

export const constructArticleCardStackWithSilentFailures = (
  dependencies: DependenciesForViews,
) => (
  expressionDois: ReadonlyArray<ExpressionDoi>,
): T.Task<ReadonlyArray<ArticleCardViewModel>> => pipe(
  expressionDois,
  T.traverseArray(constructArticleCard(dependencies)),
  T.map(RA.rights),
);
