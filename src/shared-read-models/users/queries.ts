import { LookupUser, lookupUser } from './lookup-user';
import { lookupUserByHandle } from './lookup-user-by-handle';
import { ReadModel } from './handle-event';
import { LookupUserByHandle } from '../../shared-ports';

export type Queries = {
  lookupUser: LookupUser,
  lookupUserByHandle: LookupUserByHandle,
};

export const queries = (instance: ReadModel): Queries => ({
  lookupUser: lookupUser(instance),
  lookupUserByHandle: lookupUserByHandle(instance),
});
