import { getUser } from './get-user';
import { lookupUserByHandle } from './lookup-user-by-handle';
import { ReadModel } from './handle-event';
import { GetUser, LookupUserByHandle } from '../../shared-ports';

export type Queries = {
  getUser: GetUser,
  lookupUserByHandle: LookupUserByHandle,
};

export const queries = (instance: ReadModel): Queries => ({
  getUser: getUser(instance),
  lookupUserByHandle: lookupUserByHandle(instance),
});
