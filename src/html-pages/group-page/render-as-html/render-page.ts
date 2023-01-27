import { htmlEscape } from 'escape-goat';
import { toHtmlFragment } from '../../../types/html-fragment';
import { renderFollowToggle } from '../../../write-side/follow/render-follow-toggle';
import { ViewModel } from '../view-model';
import { renderMainContent } from './render-main-content';

export const renderPage = (viewmodel: ViewModel) => toHtmlFragment(`
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
  ${renderMainContent(viewmodel)}
`);
