import * as O from 'fp-ts/Option';
import { menuFooter, menuItems } from '../shared-components/menu-items';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { User } from '../types/user';

export const menuPage = (user: O.Option<User>): Page => ({
  title: 'Menu',
  content: toHtmlFragment(`
  <nav class="navigation-menu">
    <h1 class="navigation-menu__title">Menu</h1>
    ${menuItems(user)}
    ${menuFooter}
  </nav>
  `),
});
