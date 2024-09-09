import { Json } from 'fp-ts/Json';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { ReadModel } from './handle-event';

export const papersEvaluatedByGroupStatus = (readmodel: ReadModel) => (): Json => pipe(
  readmodel.paperSnapshotRepresentatives,
  R.collect(S.Ord)((groupId, set) => ({
    groupId,
    total: set.size,
  })),
);
