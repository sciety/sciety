import * as E from 'fp-ts/Either';
import { PaperActivitySummaryCardViewModel, PaperActivityErrorCardViewModel } from '../../../shared-components/paper-activity-summary-card';
import { PaginationControlsViewModel } from '../../shared-components/pagination';
import { Group } from '../../../types/group';
import { PageHeaderViewModel } from '../common-components/render-page-header';
import { TabsViewModel } from '../common-components/tabs-view-model';
import { ListCardViewModel } from '../../../shared-components/list-card';

type NoActivity = { tag: 'no-activity-yet' };

export type OrderedArticleCards = PaginationControlsViewModel & {
  tag: 'ordered-article-cards',
  articleCards: ReadonlyArray<E.Either<PaperActivityErrorCardViewModel, PaperActivitySummaryCardViewModel>>,
};

type Content = NoActivity | OrderedArticleCards;

export type ViewModel = PageHeaderViewModel & {
  group: Group,
  featuredLists: ReadonlyArray<ListCardViewModel>,
  content: Content,
  tabs: TabsViewModel,
};
