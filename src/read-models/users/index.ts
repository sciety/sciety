import { handleEvent, initialState } from './handle-event.js';
import { lookupUserByHandle } from './lookup-user-by-handle.js';
import { lookupUser } from './lookup-user.js';
import { currentStatus } from './current-status.js';

export const users = {
  queries: {
    lookupUserByHandle,
    lookupUser,
    usersStatus: currentStatus,
  },
  initialState,
  handleEvent,
};
