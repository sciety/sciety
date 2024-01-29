import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { Dependencies } from './dependencies';
import { List } from '../../../types/list';
import * as PH from '../../../types/publishing-history';
import * as L from '../../../types/list';

export const findAllListsContainingPaper = (
  dependencies: Dependencies,
) => (
  publishingHistory: PH.PublishingHistory,
): ReadonlyArray<List> => pipe(
  publishingHistory,
  PH.getAllExpressionDois,
  RA.map(dependencies.selectAllListsContainingExpression),
  RA.flatten,
  RA.uniq(L.Eq),
);
