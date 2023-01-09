import { getUser } from './get-user';
import { ReadModel } from './handle-event';
import { GetUser } from '../../shared-ports';

type Queries = {
  getUser: GetUser,
};

export const queries = (instance: ReadModel): Queries => ({
  getUser: getUser(instance),
});
