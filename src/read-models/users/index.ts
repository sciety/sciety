import { currentStatus } from './current-status';
import { handleEvent, initialState } from './handle-event';
import { lookupUser } from './lookup-user';
import { lookupUserByHandle } from './lookup-user-by-handle';

export const users = {
  queries: {
    lookupUserByHandle,
    lookupUser,
    usersStatus: currentStatus,
  },
  initialState,
  handleEvent,
};
