import { ContentWrappedInLayout } from './content-wrapped-in-layout';
import { HtmlPage } from './html-page';
import { PageLayoutViewModel } from './page-layout-view-model';

export type RenderPageLayout = (viewModel: PageLayoutViewModel) => (page: HtmlPage) => ContentWrappedInLayout;
