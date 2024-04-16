/* eslint-disable @typescript-eslint/no-unused-vars */
import * as O from 'fp-ts/Option';
import * as RM from 'fp-ts/ReadonlyMap';
import { pipe } from 'fp-ts/function';
import { Activity, ReadModel } from './handle-event';
import { GroupId } from '../../types/group-id';

const calculateLatestActivityDate = (activity: Activity) => {
  let latest = null;
  // eslint-disable-next-line no-loops/no-loops
  for (const ev of activity.values()) {
    if (latest === null || ev.publishedAt > latest) {
      latest = ev.publishedAt;
    }
  }
  return O.fromNullable(latest);
};

type GroupActivity = {
  evaluationCount: number,
  latestActivityAt: O.Option<Date>,
};

type GetActivityForGroup = (groupId: GroupId) => O.Option<GroupActivity>;

export const getActivityForGroup = (readModel: ReadModel): GetActivityForGroup => (groupId) => pipe(
  readModel.get(groupId),
  O.fromNullable,
  O.map((state) => ({
    evaluationCount: RM.size(state),
    latestActivityAt: calculateLatestActivityDate(state),
  })),
);
