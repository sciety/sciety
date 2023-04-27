import { ReadModel } from './handle-event';
import { getActivityForGroup, GetActivityForGroup } from './get-activity-for-group';

export type Queries = {
  getActivityForGroup: GetActivityForGroup,
};

export const queries = (instance: ReadModel): Queries => ({
  getActivityForGroup: getActivityForGroup(instance),
});
