import * as O from 'fp-ts/Option';
import { HtmlFragment } from '../../types/html-fragment.js';
import { GroupId } from '../../types/group-id.js';
import { GroupLinkWithLogoViewModel } from '../../shared-components/group-link/index.js';

type CurationTeaser = {
  articleHref: string,
  groupId: GroupId,
  quote: HtmlFragment,
  caption: string,
  articleTitle: HtmlFragment,
};

export type ViewModel = {
  groups: O.Option<ReadonlyArray<GroupLinkWithLogoViewModel>>,
  curationTeasers: ReadonlyArray<CurationTeaser>,
};
