import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { UserDetails } from '../../../../types/user-details';
import { toContentWrappedInLayout } from '../../content-wrapped-in-layout';
import { mobileMenu } from '../../mobile-menu/mobile-menu';
import { PageLayout } from '../../page-layout';
import { siteFooter } from '../site-footer';
import { siteHeader } from '../site-header';

export const wrapWithHeaderAndFooter = (pageContainerClass: string, user: O.Option<UserDetails>) => (main: HtmlFragment): HtmlFragment => toHtmlFragment(`
  <div class="${pageContainerClass}">
    ${siteHeader(user)}

    ${main}
    ${siteFooter}
  </div>
  ${mobileMenu(user)}
`);

export const standardPageLayout: PageLayout = (user) => (page) => pipe(
  `
  <main id="mainContent">
    <div class="page-content">
      <div class="sciety-grid-two-columns">
        ${page.content}
      </div>
    </div>
  </main>
  `,
  toHtmlFragment,
  wrapWithHeaderAndFooter('standard-page-container', user),
  toContentWrappedInLayout,
);
