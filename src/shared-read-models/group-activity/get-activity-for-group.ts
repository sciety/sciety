/* eslint-disable @typescript-eslint/no-unused-vars */
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as D from 'fp-ts/Date';
import { ReadModel } from './handle-event';
import { GroupId } from '../../types/group-id';

type GroupActivity = {
  evaluationCount: number,
  latestActivityAt: O.Option<Date>,
};

export type GetActivityForGroup = (groupId: GroupId) => O.Option<GroupActivity>;

export const getActivityForGroup = (readModel: ReadModel): GetActivityForGroup => (groupId) => pipe(
  readModel.get(groupId),
  O.fromNullable,
  O.map((state) => ({
    evaluationCount: state.evaluationStates.length,
    latestActivityAt: pipe(
      state.evaluationStates,
      RA.map((evaluationState) => evaluationState.publishedAt),
      RA.sort(D.Ord),
      RA.last,
    ),
  })),
);
