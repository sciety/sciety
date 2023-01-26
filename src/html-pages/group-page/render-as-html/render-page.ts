import { htmlEscape } from 'escape-goat';
import { toHtmlFragment } from '../../../types/html-fragment';
import { ViewModel } from '../view-model';

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
    ${viewmodel.followButton}
  </div>
  ${viewmodel.content}
`);
