import { handleEvent, initialState } from './handle-event.js';
import { getAllGroups } from './get-all-groups.js';
import { getGroup } from './get-group.js';
import { getGroupBySlug } from './get-group-by-slug.js';

export const groups = {
  queries: {
    getAllGroups,
    getGroupBySlug,
    getGroup,
  },
  initialState,
  handleEvent,
};
