import * as D from 'fp-ts/Date';
import * as O from 'fp-ts/Option';
import * as Ord from 'fp-ts/Ord';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { EvaluatedPaper, ReadModel } from './handle-event';
import { GroupId } from '../../types/group-id';

export const byRepresentative: Ord.Ord<EvaluatedPaper> = pipe(
  S.Ord,
  Ord.contramap((entry) => entry.representative),
);

export const byLastEvaluatedAt: Ord.Ord<EvaluatedPaper> = pipe(
  D.Ord,
  Ord.reverse,
  Ord.contramap((entry) => entry.lastEvaluatedAt),
);

const convertArrayOfUniqueElementsToASet = (evaluatedPapers: ReadonlyArray<EvaluatedPaper>) => new Set(evaluatedPapers);

export const getPapersEvaluatedByGroup = (
  readModel: ReadModel,
) => (
  groupId: GroupId,
): ReadonlySet<EvaluatedPaper> => pipe(
  readModel.evaluatedPapers,
  R.lookup(groupId),
  O.map(convertArrayOfUniqueElementsToASet),
  O.getOrElseW(() => new Set<EvaluatedPaper>()),
);
