import { drawerNavItems } from './drawer-nav-items';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const drawer = (): HtmlFragment => toHtmlFragment(`
  <nav class="drawer">
    <a href="/" class="drawer__logo_link" aria-hidden="true">
      <img src="/static/images/sciety-logo-white-text.svg " alt="Sciety" class="drawer__logo">
    </a>
    ${drawerNavItems()}
  </nav>
  `);
