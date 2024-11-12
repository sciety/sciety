import { Dependencies } from './construct-layout-view-model';
import { ContentWrappedInLayout } from './content-wrapped-in-layout';
import { HtmlPage } from './html-page';

export type PageLayout = (dependencies: Dependencies) => (page: HtmlPage) => ContentWrappedInLayout;
