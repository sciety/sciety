import { getUser } from './get-user';
import { ReadModel } from './handle-event';
import { GetUser } from '../../shared-ports';

// ts-unused-exports:disable-next-line
export type Queries = {
  getUser: GetUser,
};

// ts-unused-exports:disable-next-line
export const queries = (instance: ReadModel): Queries => ({
  getUser: getUser(instance),
});
