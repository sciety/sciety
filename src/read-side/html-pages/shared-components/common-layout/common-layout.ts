import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { mobileMenu } from './mobile-menu';
import { siteFooter } from './site-footer';
import { ColourSchemes, siteHeader } from './site-header';
import { HtmlFragment } from '../../../../types/html-fragment';
import { UserDetails } from '../../../../types/user-details';
import { ContentWrappedInLayout, toContentWrappedInLayout } from '../../content-wrapped-in-layout';

export const commonLayout = (pageContainerClass: string, user: O.Option<UserDetails>, scheme: ColourSchemes = 'light') => (main: HtmlFragment): ContentWrappedInLayout => pipe(
  `
  <div class="${pageContainerClass}">
    ${siteHeader(user, scheme)}

    ${main}
    ${siteFooter}
  </div>
  ${mobileMenu(user)}
  `,
  toContentWrappedInLayout,
);
