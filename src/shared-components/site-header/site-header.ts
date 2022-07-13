import * as O from 'fp-ts/Option';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { User } from '../../types/user';
import { utilityBar } from '../utility-bar';

export const siteHeader = (user: O.Option<User>): HtmlFragment => toHtmlFragment(`<header class="site-header">
  <div class="site-header__white_box_padding"></div>  
  <nav class="site-header__white_box">
    <ul class="site-header__white_box_list">
      <li class="site-header__white_box_list_item--logo">
        <a href="/" class="site-header__logo_link">
          <img src="/static/images/sciety-logo-blue-text.svg " alt="Sciety" class="site-header__logo">
        </a>
      </li>
      <li class="site-header__white_box_list_item--narrow-only">
        <a href="/menu" class="site-header__menu_link">
          <img src="/static/images/menu-icon.svg" alt="" />
        </a>
      </li>
      <li>
        <a href="/search" class="site-header__search_link">
          <img src="/static/images/search-icon.svg" alt="" class="site-header__search_icon"><span class="site-header__search_label">Search</span>
        </a>
      </li>
    </ul>
  </nav>
  <div class="site-header__grey_box">
    ${utilityBar(user)}
  </div>
  <div></div> 
</header>`);
