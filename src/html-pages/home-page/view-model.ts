import * as O from 'fp-ts/Option';
import { HtmlFragment } from '../../types/html-fragment';
import { GroupsViewModel } from './render-groups';

export type ViewModel = {
  groups: O.Option<GroupsViewModel>,
  cards: HtmlFragment,
};
