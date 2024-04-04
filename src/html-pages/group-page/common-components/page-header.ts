import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { Group } from '../../../types/group';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { renderFollowToggle } from './render-follow-toggle';

export type PageHeaderViewModel = {
  group: Group,
  isFollowing: boolean,
  followerCount: number,
};

const renderPageHeaderIdentity = (group: PageHeaderViewModel['group']) => pipe(
  group.largeLogoPath,
  O.match(
    () => `<h1>${htmlEscape(group.name)}</h1>`,
    (largeLogoPath) => htmlEscape`
    <h1 class="page-header__visual_heading">
      <img src="${largeLogoPath}" alt="${group.name}" class="page-header__large_logo">
    </h1>
  `,
  ),
);

const renderGroupFollowersLink = (slug: string) => `<a href="/groups/${slug}/followers-standalone">Followers</a>`;

export const renderPageHeader = (viewmodel: PageHeaderViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header">
    <div class="page-header__identity">
      ${renderPageHeaderIdentity(viewmodel.group)}
    </div>
    <p class="group-page-short-description">
      ${htmlEscape(viewmodel.group.shortDescription)}
    </p>
    <div class="group-page-actions">
      ${renderFollowToggle(viewmodel.group.id, viewmodel.group.name)(viewmodel.isFollowing)}
      ${renderGroupFollowersLink(viewmodel.group.slug)}
    </div>
  </header>
`);
