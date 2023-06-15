import { handleEvent, initialState } from './handle-event';
import { lookupUserByHandle } from './lookup-user-by-handle';
import { lookupUser } from './lookup-user';

export const users = {
  queries: {
    lookupUserByHandle,
    lookupUser,
  },
  initialState,
  handleEvent,
};
