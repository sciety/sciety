import * as O from 'fp-ts/Option';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { UserDetails } from '../../types/user-details';
import { utilityBar } from '../utility-bar/utility-bar';

type ColourSchemes = 'light' | 'dark';

export const siteHeader = (user: O.Option<UserDetails>, scheme: ColourSchemes = 'light'): HtmlFragment => toHtmlFragment(`
<header class="site-header${scheme === 'dark' ? ' site-header--dark' : ''}">
  <a href="#mainContent" class="visually-hidden">Skip navigation</a>
  <div></div>  
  <nav class="site-header__left_links">
    <ul class="site-header__left_links_list">
      <li class="site-header__left_links_list_item--logo">
        <a href="/" class="site-header__logo_link">
          <img src="/static/images/${scheme === 'dark' ? 'sciety-logo-white-text.svg' : 'sciety-logo-navigation-link-colour-text.svg'}" alt="Sciety" class="site-header__logo">
        </a>
      </li>
      <li class="site-header__left_links_list_item--menu">
        <a href="/menu" class="site-header__menu_link">
          <img src="/static/images/${scheme === 'dark' ? 'menu-icon-white.svg' : 'menu-icon.svg'}" alt="" />
        </a>
      </li>
      <li>
        <a href="/search" class="site-header__search_link">
          <img src="/static/images/search-icon.svg" alt="" class="site-header__search_icon"><span class="site-header__search_label">Search</span>
        </a>
      </li>
    </ul>
  </nav>
  <div class="site-header__right_links">
    ${utilityBar(user, scheme)}
  </div>
  <div></div> 
</header>`);
