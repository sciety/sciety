import { ArticleCardViewModel } from '../../../shared-components/article-card';
import { Group } from '../../../types/group';
import { PageHeaderViewModel } from '../common-components/page-header';
import { TabsViewModel } from '../common-components/tabs-view-model';

export type ViewModel = PageHeaderViewModel & {
  group: Group,
  articleCards: ReadonlyArray<ArticleCardViewModel>,
  tabs: TabsViewModel,
};
