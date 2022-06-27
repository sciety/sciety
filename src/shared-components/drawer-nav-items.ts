import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const drawerNavItems = (): HtmlFragment => toHtmlFragment(`
  <ul role="list" class="site-menu__links">
    <li><a href="/sciety-feed" class="site-menu__link site-menu__link--sciety-feed"><span class="site-menu__link_text">Sciety feed</span></a></li>
  </ul>
`);
