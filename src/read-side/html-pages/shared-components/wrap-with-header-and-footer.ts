import * as O from 'fp-ts/Option';
import { siteFooter } from './site-footer';
import { siteHeader } from './site-header';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { UserDetails } from '../../../types/user-details';
import { mobileMenu } from '../mobile-menu/mobile-menu';

export const wrapWithHeaderAndFooter = (pageContainerClass: string, user: O.Option<UserDetails>) => (main: HtmlFragment): HtmlFragment => toHtmlFragment(`
  <div class="${pageContainerClass}">
    ${siteHeader(user)}

    ${main}
    ${siteFooter}
  </div>
  ${mobileMenu(user)}
`);
