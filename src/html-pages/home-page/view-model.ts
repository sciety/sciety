import * as O from 'fp-ts/Option';
import { GroupId } from '../../types/group-id';
import { HtmlFragment } from '../../types/html-fragment';
import { GroupLinkWithLogoViewModel } from '../shared-components/group-link';

type CurationTeaser = {
  articleHref: string,
  groupId: GroupId,
  quote: HtmlFragment,
  caption: string,
  articleTitle: HtmlFragment,
};

export type ViewModel = {
  pageHeading: string,
  groups: O.Option<ReadonlyArray<GroupLinkWithLogoViewModel>>,
  curationTeasers: ReadonlyArray<CurationTeaser>,
};
