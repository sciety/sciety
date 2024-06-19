import { getAdminsForGroup } from './get-admins-for-group';
import { handleEvent, initialState } from './handle-event';
import { isUserAdminOfGroup } from './is-user-admin-of-group';

export const groupAuthorisations = {
  queries: {
    isUserAdminOfGroup,
    getAdminsForGroup,
  },
  initialState,
  handleEvent,
};
