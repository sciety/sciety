import * as O from 'fp-ts/Option';
import { siteMenuFooter, siteMenuItems } from './site-menu';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { User } from '../types/user';

export const drawer = (user: O.Option<User>): HtmlFragment => toHtmlFragment(`
  <nav class="drawer">
    <a href="/" class="drawer__logo_link" aria-hidden="true">
      <img src="/static/images/sciety-logo-white-text.svg " alt="Sciety" class="drawer__logo">
    </a>
    ${siteMenuItems(user)}
    ${siteMenuFooter}
  </nav>
  `);
