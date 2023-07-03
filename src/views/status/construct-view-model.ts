import { Json } from 'fp-ts/Json';
import { Queries } from '../../shared-read-models';

export const constructViewModel = (queries: Queries): Json => ({
  evaluations: queries.evaluationsStatus(),
  followings: queries.followingsStatus(),
  groups: {
    total: queries.getAllGroups().length,
  },
  lists: queries.listsStatus(),
  users: queries.usersStatus(),
});
