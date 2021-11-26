import * as O from 'fp-ts/Option';
import { GroupId } from '../../types/group-id';

export type List = {
  name: string,
  description: string,
  articleCount: number,
  lastUpdated: O.Option<Date>,
  ownerId: GroupId,
};
