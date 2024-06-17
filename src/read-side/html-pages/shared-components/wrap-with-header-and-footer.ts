import * as O from 'fp-ts/Option';
import { siteFooter } from './site-footer';
import { siteHeader } from './site-header';
import { ColourSchemes } from './site-header/colour-schemes';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { UserDetails } from '../../../types/user-details';
import { mobileMenu } from '../mobile-menu/mobile-menu';

export const wrapWithHeaderAndFooter = (pageContainerClass: string, user: O.Option<UserDetails>, scheme: ColourSchemes = 'light') => (main: HtmlFragment): HtmlFragment => toHtmlFragment(`
  <div class="${pageContainerClass}">
    ${siteHeader(user, scheme)}

    ${main}
    ${siteFooter}
  </div>
  ${mobileMenu(user)}
`);
