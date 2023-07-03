import { handleEvent, initialState } from './handle-event';
import { lookupUserByHandle } from './lookup-user-by-handle';
import { lookupUser } from './lookup-user';
import { currentStatus } from './current-status';

export const users = {
  queries: {
    lookupUserByHandle,
    lookupUser,
    usersStatus: currentStatus,
  },
  initialState,
  handleEvent,
};
