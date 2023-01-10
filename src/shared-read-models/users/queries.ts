import { getUser } from './get-user';
import { getUserViaHandle } from './get-user-via-handle';
import { ReadModel } from './handle-event';
import { GetUser, GetUserViaHandle } from '../../shared-ports';

export type Queries = {
  getUser: GetUser,
  getUserViaHandle: GetUserViaHandle,
};

export const queries = (instance: ReadModel): Queries => ({
  getUser: getUser(instance),
  getUserViaHandle: getUserViaHandle(instance),
});
