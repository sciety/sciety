import { GetActivityForDoi, GetActivityForDois } from '../../shared-ports';
import { getActivityForDoi } from './get-activity-for-doi';
import { getActivityForDois } from './get-activity-for-dois';
import { ReadModel } from './handle-event';

export type Queries = {
  getActivityForDoi: GetActivityForDoi,
  getActivityForDois: GetActivityForDois,
};

export const queries = (instance: ReadModel): Queries => ({
  getActivityForDoi: getActivityForDoi(instance),
  getActivityForDois: getActivityForDois(instance),

});
