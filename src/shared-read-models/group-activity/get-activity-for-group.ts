/* eslint-disable @typescript-eslint/no-unused-vars */
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { GroupActivity, ReadModel } from './handle-event';
import { GroupId } from '../../types/group-id';

export type GetActivityForGroup = (groupId: GroupId) => O.Option<GroupActivity>;

export const getActivityForGroup = (readModel: ReadModel): GetActivityForGroup => (groupId) => pipe(
  readModel,
  R.lookup(groupId),
  O.map((state) => ({
    evaluationCount: state.evaluationLocators.length,
    latestActivityAt: state.latestActivityAt,
  })),
);
