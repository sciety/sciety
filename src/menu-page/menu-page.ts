import * as O from 'fp-ts/Option';
import { menuItems } from '../shared-components/menu-items';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { User } from '../types/user';

export const menuPage = (user: O.Option<User>): Page => ({
  title: 'Menu',
  content: toHtmlFragment(`
  <nav class="navigation-menu">
    <h1 class="navigation-menu__title">Menu</h1>
    ${menuItems(user)}
    <footer class="navigation-menu__footer">
      <a href="https://eepurl.com/g7qqcv" class="navigation-menu__feedback_button">Feedback</a>
      <small class="navigation-menu__small_print">
        &copy; 2021 eLife Sciences Publications Ltd.
        <a href="/legal">Legal information</a>
      </small>
    </footer>
  </nav>
  `),
});
