import { handleEvent, initialState } from './handle-event';
import { isUserAdminOfGroup } from './is-user-admin-of-group';

export { isUserAdminOfGroup } from './is-user-admin-of-group';
export const groupAuthorisations = {
  queries: {
    isUserAdminOfGroup,
  },
  initialState,
  handleEvent,
};
