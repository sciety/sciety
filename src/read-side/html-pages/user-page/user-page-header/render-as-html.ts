import { htmlEscape } from 'escape-goat';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { UserDetails } from '../../../../types/user-details';
import { constructUserAvatarSrc } from '../../../paths';

export const renderAsHtml = (viewmodel: UserDetails): HtmlFragment => toHtmlFragment(`
  <header class="page-header page-header--user page-header__identity">
    <img src="${constructUserAvatarSrc(viewmodel)}" alt="" class="page-header__avatar">
    <h1>
      <span class="visually-hidden">Sciety user </span>${htmlEscape(viewmodel.displayName)}
      <div class="page-header__handle">
        <span class="visually-hidden">Sciety handle </span>@${viewmodel.handle}
      </div>
    </h1>
  </header>
`);
