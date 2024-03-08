import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { PaperActivitySummaryCardViewModel, PaperActivityErrorCardViewModel } from '../../../shared-components/paper-activity-summary-card';
import { PaginationControlsViewModel } from '../../../shared-components/pagination';
import { Group } from '../../../types/group';
import { PageHeaderViewModel } from '../common-components/page-header';
import { TabsViewModel } from '../common-components/tabs-view-model';
import { ListCardWithImageViewModel } from '../../../shared-components/list-card/render-list-card-with-image';

type NoActivity = { tag: 'no-activity-yet' };

export type OrderedArticleCards = PaginationControlsViewModel & {
  tag: 'ordered-article-cards',
  articleCards: ReadonlyArray<E.Either<PaperActivityErrorCardViewModel, PaperActivitySummaryCardViewModel>>,
};

type Content = NoActivity | OrderedArticleCards;

export type ViewModel = PageHeaderViewModel & {
  group: Group,
  collections: O.Option<ListCardWithImageViewModel>,
  content: Content,
  tabs: TabsViewModel,
};
