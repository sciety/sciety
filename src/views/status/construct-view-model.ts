import { Json } from 'fp-ts/Json';
import { Queries } from '../../shared-read-models';

export const constructViewModel = (queries: Queries): Json => ({
  groups: {
    total: queries.getAllGroups().length,
  },
});
