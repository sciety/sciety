import { GetActivityForDoi, getActivityForDoi } from './get-activity-for-doi';
import { ReadModel } from './handle-event';

export type Queries = {
  getActivityForDoi: GetActivityForDoi,
};

export const queries = (instance: ReadModel): Queries => ({
  getActivityForDoi: getActivityForDoi(instance),
});
