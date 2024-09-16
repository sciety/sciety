import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { ReadModel } from './handle-event';
import { GroupId } from '../../types/group-id';

type Status = ReadonlyArray<{
  groupId: GroupId,
  total: number,
}>;

export const papersEvaluatedByGroupStatus = (readmodel: ReadModel) => (): Status => pipe(
  readmodel.evaluatedPapers,
  R.collect(S.Ord)((groupId, papersOfThisGroup) => ({
    groupId,
    total: papersOfThisGroup.length,
  })),
);
