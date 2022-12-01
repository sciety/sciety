import { getAllGroups } from './get-all-groups';
import { getGroup } from './get-group';
import { ReadModel } from './handle-event';
import { GetGroup } from '../../shared-ports';
import { GetAllGroups } from '../../shared-ports/get-all-groups';

export type Queries = {
  getGroup: GetGroup,
  getAllGroups: GetAllGroups,
};

export const queries = (instance: ReadModel): Queries => ({
  getGroup: getGroup(instance),
  getAllGroups: getAllGroups(instance),
});
