import * as O from 'fp-ts/Option';
import { GroupId } from '../../types/group-id.js';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment.js';

export type GroupCardViewModel = {
  id: GroupId,
  name: string,
  description: SanitisedHtmlFragment,
  avatarPath: string,
  slug: string,
  listCount: number,
  followerCount: number,
  evaluationCount: number,
  curatedArticlesCount: number,
  latestActivityAt: O.Option<Date>,
  groupPageHref: string,
};
