import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DependenciesForViews } from './dependencies-for-views';
import { eqList, List } from '../read-models/lists';
import * as PH from '../types/publishing-history';

export const findAllListsContainingPaper = (
  dependencies: DependenciesForViews,
) => (
  publishingHistory: PH.PublishingHistory,
): ReadonlyArray<List> => pipe(
  publishingHistory,
  PH.getAllExpressionDois,
  RA.map(dependencies.selectAllListsContainingExpression),
  RA.flatten,
  RA.uniq(eqList),
);
