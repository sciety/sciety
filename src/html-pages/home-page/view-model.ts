import * as O from 'fp-ts/Option';
import { GroupsViewModel } from './render-as-html/render-groups';
import { HtmlFragment } from '../../types/html-fragment';
import { GroupId } from '../../types/group-id';

type CurationTeaser = {
  articleLink: string,
  groupId: GroupId,
  quote: HtmlFragment,
  caption: string,
  articleTitle: HtmlFragment,
};

export type ViewModel = {
  groups: O.Option<GroupsViewModel>,
  curationTeasers: ReadonlyArray<CurationTeaser>,
};
