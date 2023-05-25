import * as O from 'fp-ts/Option';
import { GroupsViewModel } from './render-as-html/render-groups';

export type ViewModel = {
  groups: O.Option<GroupsViewModel>,
};
