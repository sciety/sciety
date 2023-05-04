import { LookupUser, lookupUser } from './lookup-user';
import { LookupUserByHandle, lookupUserByHandle } from './lookup-user-by-handle';
import { ReadModel } from './handle-event';

export type Queries = {
  lookupUser: LookupUser,
  lookupUserByHandle: LookupUserByHandle,
};

export const queries = (instance: ReadModel): Queries => ({
  lookupUser: lookupUser(instance),
  lookupUserByHandle: lookupUserByHandle(instance),
});
