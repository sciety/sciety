import { getFollowers } from './get-followers';
import { ReadModel } from './handle-event';
import { GetFollowers } from '../../shared-ports';

export type Queries = {
  getFollowers: GetFollowers,
};

export const queries = (instance: ReadModel): Queries => ({
  getFollowers: getFollowers(instance),
});
