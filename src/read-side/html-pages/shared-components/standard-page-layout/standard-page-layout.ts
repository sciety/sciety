import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { UserDetails } from '../../../../types/user-details';
import { toContentWrappedInLayout } from '../../content-wrapped-in-layout';
import { mobileMenu } from '../../mobile-menu/mobile-menu';
import { PageLayout } from '../../page-layout';
import { siteFooter } from '../site-footer';
import { siteHeader } from '../site-header';

const wrapWithHeaderAndFooter = (pageContainerClass: string, user: O.Option<UserDetails>) => (main: string) => `
  <div class="${pageContainerClass}">
    ${siteHeader(user)}

    ${main}
    ${siteFooter}
  </div>
  ${mobileMenu(user)}
`;

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
  wrapWithHeaderAndFooter('standard-page-container', user),
  toContentWrappedInLayout,
);
