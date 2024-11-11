import { ContentWrappedInLayout } from './content-wrapped-in-layout';
import { HtmlPage } from './html-page';
import { PageLayoutViewModel } from './page-layout-view-model';

export type PageLayout = (viewModel: PageLayoutViewModel) => (page: HtmlPage) => ContentWrappedInLayout;
