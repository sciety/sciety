import { handleEvent, initialState } from './handle-event';
import { queries } from './queries';

export { handleEvent, initialState } from './handle-event';
export { getGroup } from './get-group';
export { getAllGroups } from './get-all-groups';
export { queries, Queries } from './queries';

export const readmodel = {
  initialState,
  handleEvent,
  queries,
};
