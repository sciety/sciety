import { HtmlPage } from './html-page';
import { PageLayout } from './page-layout';

export type HtmlPageWithSpecifiedLayout = HtmlPage & {
  layout?: PageLayout,
};
