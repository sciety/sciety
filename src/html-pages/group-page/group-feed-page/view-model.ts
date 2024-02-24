import * as E from 'fp-ts/Either';
import { PaperActivitySummaryCardViewModel, PaperActivityErrorCardViewModel } from '../../../shared-components/paper-activity-summary-card/index.js';
import { PaginationControlsViewModel } from '../../../shared-components/pagination/index.js';
import { Group } from '../../../types/group.js';
import { PageHeaderViewModel } from '../common-components/page-header.js';
import { TabsViewModel } from '../common-components/tabs-view-model.js';

type NoActivity = { tag: 'no-activity-yet' };

export type OrderedArticleCards = PaginationControlsViewModel & {
  tag: 'ordered-article-cards',
  articleCards: ReadonlyArray<E.Either<PaperActivityErrorCardViewModel, PaperActivitySummaryCardViewModel>>,
};

type Content = NoActivity | OrderedArticleCards;

export type ViewModel = PageHeaderViewModel & {
  group: Group,
  content: Content,
  tabs: TabsViewModel,
};
