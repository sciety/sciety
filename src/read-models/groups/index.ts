import { getAllGroups } from './get-all-groups';
import { getGroup } from './get-group';
import { getGroupBySlug } from './get-group-by-slug';
import { handleEvent, initialState } from './handle-event';

export const groups = {
  queries: {
    getAllGroups,
    getGroupBySlug,
    getGroup,
  },
  initialState,
  handleEvent,
};
