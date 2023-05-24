import * as O from 'fp-ts/Option';
import { GroupsViewModel } from './render-groups';

export type ViewModel = {
  groups: O.Option<GroupsViewModel>,
};
