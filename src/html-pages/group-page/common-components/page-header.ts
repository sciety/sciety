import { htmlEscape } from 'escape-goat';
import { Group } from '../../../types/group';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { renderFollowToggle } from './render-follow-toggle';

export type PageHeaderViewModel = {
  group: Group,
  isFollowing: boolean,
};

export const renderPageHeader = (viewmodel: PageHeaderViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header page-header--group">
    <div class="page-header__identity">
      <img src="${viewmodel.group.avatarPath}" alt="" class="page-header__avatar">
      <h1>
        ${htmlEscape(viewmodel.group.name)}
      </h1>
    </div>
    <p>
      ${htmlEscape(viewmodel.group.shortDescription)}
    </p>
  </header>
  <div class="group-page-follow-toggle">
    ${renderFollowToggle(viewmodel.group.id, viewmodel.group.name)(viewmodel.isFollowing)}
  </div>
`);
