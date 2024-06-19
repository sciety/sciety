import { getAdminsForAGroup } from './get-admins-for-a-group';
import { handleEvent, initialState } from './handle-event';
import { isUserAdminOfGroup } from './is-user-admin-of-group';

export const groupAuthorisations = {
  queries: {
    isUserAdminOfGroup,
    getAdminsForAGroup,
  },
  initialState,
  handleEvent,
};
