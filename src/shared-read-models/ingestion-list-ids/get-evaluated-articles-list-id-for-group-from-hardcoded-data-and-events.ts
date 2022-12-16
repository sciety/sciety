import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { GetEvaluatedArticlesListIdForGroup } from '../../shared-ports';

export const getEvaluatedArticlesListIdForGroupFromHardcodedDataAndEvents = (
  readModel: ReadModel,
): GetEvaluatedArticlesListIdForGroup => (
  groupId,
) => pipe(
  readModel,
  R.lookup(groupId),
);
