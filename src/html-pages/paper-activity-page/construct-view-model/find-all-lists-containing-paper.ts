import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { List } from '../../../types/list';
import * as PH from '../../../types/publishing-history';

export const findAllListsContainingPaper = (
  dependencies: Dependencies,
) => (
  publishingHistory: PH.PublishingHistory,
): ReadonlyArray<List> => pipe(
  publishingHistory,
  PH.getAllExpressionDois,
  (dois) => dois[0],
  dependencies.selectAllListsContainingExpression,
);
