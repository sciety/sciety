import { drawerNavItems } from './drawer-nav-items';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const drawer = (): HtmlFragment => toHtmlFragment(`
  <nav class="drawer" aria-hidden="true">
    ${drawerNavItems()}
  </nav>
  `);
