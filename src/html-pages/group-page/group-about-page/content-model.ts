import { Group } from '../../../types/group';
import { List } from '../../../types/list';

export type ContentModel = {
  group: Group,
  lists: ReadonlyArray<List>,
};
