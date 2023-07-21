/* eslint-disable @typescript-eslint/no-unused-vars */
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as RM from 'fp-ts/ReadonlyMap';
import { Activity, ReadModel } from './handle-event';
import { GroupId } from '../../types/group-id';

type GroupActivity = {
  evaluationCount: number,
  latestActivityAt: O.Option<Date>,
};

const calculateLatestActivityDate = (activity: Activity) => {
  let latest = null;
  // eslint-disable-next-line no-loops/no-loops
  for (const ev of activity.evaluationStates.values()) {
    if (latest === null || ev.publishedAt > latest) {
      latest = ev.publishedAt;
    }
  }
  return O.fromNullable(latest);
};

type GetActivityForGroup = (groupId: GroupId) => O.Option<GroupActivity>;

export const getActivityForGroup = (readModel: ReadModel): GetActivityForGroup => (groupId) => pipe(
  readModel.get(groupId),
  O.fromNullable,
  O.map((state) => ({
    evaluationCount: pipe(
      state.evaluationStates,
      RM.size,
    ),
    latestActivityAt: calculateLatestActivityDate(state),
  })),
);
