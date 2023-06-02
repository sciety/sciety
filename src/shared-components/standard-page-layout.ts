import * as O from 'fp-ts/Option';
import { Page } from '../types/page';
import { UserDetails } from '../types/user-details';
import { fullWidthPageLayout } from './full-width-page-layout';
import { toHtmlFragment } from '../types/html-fragment';

export const standardPageLayout = (user: O.Option<UserDetails>) => (page: Page): string => (
  fullWidthPageLayout(user)(
    {
      ...page,
      content: toHtmlFragment(`<div class="sciety-grid-two-columns">${page.content}</div>`),
    },
  )
);
