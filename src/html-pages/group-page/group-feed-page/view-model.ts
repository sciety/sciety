import * as E from 'fp-ts/Either';
import { ArticleCardViewModel, ArticleErrorCardViewModel } from '../../../shared-components/article-card';
import { Group } from '../../../types/group';
import { PageHeaderViewModel } from '../common-components/page-header';
import { TabsViewModel } from '../common-components/tabs-view-model';

type Content = 'no-activity-yet' | ReadonlyArray<E.Either<ArticleErrorCardViewModel, ArticleCardViewModel>>;

export type ViewModel = PageHeaderViewModel & {
  group: Group,
  content: Content,
  tabs: TabsViewModel,
};
