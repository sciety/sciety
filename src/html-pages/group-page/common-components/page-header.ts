import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { Group } from '../../../types/group';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { renderFollowToggle } from './render-follow-toggle';

export type PageHeaderViewModel = {
  group: Group,
  isFollowing: boolean,
};

const renderPageHeaderIdentityAsLargeLogo = (group: PageHeaderViewModel['group']) => pipe(
  group.largeLogoPath,
  O.match(
    () => `<h1>${htmlEscape(group.name)}</h1>`,
    (largeLogoPath) => `
    <h1>
      <img src="${largeLogoPath}" alt="${group.name}" class="page-header__large_logo">
    </h1>
  `,
  ),
);

const renderPageHeaderIdentity = (group: PageHeaderViewModel['group']) => {
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    return renderPageHeaderIdentityAsLargeLogo(group);
  }
  return `
    <img src="${group.avatarPath}" alt="" class="page-header__avatar">
    <h1>
      ${htmlEscape(group.name)}
    </h1>
  `;
};

export const renderPageHeader = (viewmodel: PageHeaderViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header page-header--group">
    <div class="page-header__identity">
      ${renderPageHeaderIdentity(viewmodel.group)}
    </div>
    <p>
      ${htmlEscape(viewmodel.group.shortDescription)}
    </p>
  </header>
  <div class="group-page-follow-toggle">
    ${renderFollowToggle(viewmodel.group.id, viewmodel.group.name)(viewmodel.isFollowing)}
  </div>
`);
