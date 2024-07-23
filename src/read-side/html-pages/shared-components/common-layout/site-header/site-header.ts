import * as O from 'fp-ts/Option';
import { ColourSchemes } from './colour-schemes';
import { utilityBar } from './utility-bar';
import { HtmlFragment, toHtmlFragment } from '../../../../../types/html-fragment';
import { UserDetails } from '../../../../../types/user-details';

const schemedImages = {
  light: {
    scietyLogo: 'sciety-logo-navigation-link-colour-text.svg',
    menuIcon: 'menu-icon.svg',
  },
  dark: {
    scietyLogo: 'sciety-logo-white-text.svg',
    menuIcon: 'menu-icon-white.svg',
  },
};

export const siteHeader = (user: O.Option<UserDetails>, scheme: ColourSchemes = 'light'): HtmlFragment => toHtmlFragment(`
<header class="site-header${scheme === 'dark' ? ' site-header--dark' : ''}" id="mobileMenuReturnPoint">
  <a href="#mainContent" class="visually-hidden">Skip navigation</a>
  <nav class="site-header__left_links">
    <ul class="site-header__left_links_list">
      <li class="site-header__left_links_list_item--menu">
        <a href="#mobileNavigation" class="site-header__menu_link">
          <img src="/static/images/${schemedImages[scheme].menuIcon}" alt="" class="site-header__menu_icon"/>
        </a>
      </li>
      <li class="site-header__left_links_list_item--logo">
        <a href="/" class="site-header__logo_link">
          <img src="/static/images/${schemedImages[scheme].scietyLogo}" alt="Sciety" class="site-header__logo">
        </a>
      </li>
      <li>
        <a href="/search" class="site-header__search_link">
          <img src="/static/images/search-icon.svg" alt="" class="site-header__search_icon"><span class="site-header__search_label">Explore</span>
        </a>
      </li>
    </ul>
  </nav>
  <div class="site-header__right_links">
    ${utilityBar(user, scheme)}
  </div>
</header>`);
