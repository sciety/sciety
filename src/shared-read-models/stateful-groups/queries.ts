import { getGroup } from './get-group';
import { ReadModel } from './handle-event';
import { GetGroup } from '../../shared-ports';

export type Queries = {
  getGroup: GetGroup,
};

export const queries = (instance: ReadModel): Queries => ({
  getGroup: getGroup(instance),
});
