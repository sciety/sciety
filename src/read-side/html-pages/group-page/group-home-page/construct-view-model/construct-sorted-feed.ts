import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { byLastEvaluationPublishedAt } from '../../../../../read-models/papers-evaluated-by-group';
import { ExpressionDoi } from '../../../../../types/expression-doi';
import { GroupId } from '../../../../../types/group-id';

export const constructSortedFeed = (
  dependencies: Dependencies,
  groupId: GroupId,
): ReadonlyArray<ExpressionDoi> => pipe(
  dependencies.getPapersEvaluatedByGroup(groupId),
  (evaluatedPapers) => Array.from(evaluatedPapers),
  RA.sort(byLastEvaluationPublishedAt),
  RA.map((evaluatedPaper) => evaluatedPaper.representative),
);