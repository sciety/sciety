import { fullWidthPageLayout } from './full-width-page-layout';
import { toHtmlFragment } from '../types/html-fragment';
import { PageLayout } from '../html-pages/page-layout';

export const standardPageLayout: PageLayout = (user) => (page) => (
  fullWidthPageLayout(user)(
    {
      ...page,
      content: toHtmlFragment(`<div class="sciety-grid-two-columns">${page.content}</div>`),
    },
  )
);
