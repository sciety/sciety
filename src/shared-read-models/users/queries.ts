import { getUser } from './get-user';
import { lookupUser } from './lookup-user';
import { ReadModel } from './handle-event';
import { GetUser, LookupUser } from '../../shared-ports';

export type Queries = {
  getUser: GetUser,
  lookupUser: LookupUser,
};

export const queries = (instance: ReadModel): Queries => ({
  getUser: getUser(instance),
  lookupUser: lookupUser(instance),
});
