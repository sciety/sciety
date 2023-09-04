import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { Doi } from '../../../types/doi';
import { ViewModel } from '../view-model';
import { Dependencies } from './dependencies';

export const constructReviewingGroups = (
  dependencies: Dependencies,
  articleId: Doi,
): ViewModel['reviewingGroups'] => pipe(
  articleId,
  dependencies.getEvaluationsForDoi,
  RA.map((evaluation) => evaluation.groupId),
  RA.map((groupId) => dependencies.getGroup(groupId)),
  RA.compact,
  RA.map((group) => group.name),
  (groupNames) => [...new Set(groupNames)],
);
