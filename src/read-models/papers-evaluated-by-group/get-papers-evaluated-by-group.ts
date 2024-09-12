import * as D from 'fp-ts/Date';
import * as O from 'fp-ts/Option';
import * as Ord from 'fp-ts/Ord';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { EvaluatedPaper, ReadModel } from './handle-event';
import { GroupId } from '../../types/group-id';

export const byLastEvaluationPublishedAt: Ord.Ord<EvaluatedPaper> = pipe(
  D.Ord,
  Ord.reverse,
  Ord.contramap((entry) => entry.lastEvaluationPublishedAt),
);

export const getPapersEvaluatedByGroup = (
  readModel: ReadModel,
) => (
  groupId: GroupId,
): ReadonlySet<EvaluatedPaper> => pipe(
  readModel.evaluatedPapers,
  R.lookup(groupId),
  O.getOrElseW(() => new Set<EvaluatedPaper>()),
);
