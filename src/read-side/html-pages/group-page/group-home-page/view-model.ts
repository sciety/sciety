import * as E from 'fp-ts/Either';
import { PageHeaderViewModel } from './render-as-html/render-page-header';
import { PaginationControlsViewModel } from '../../../../html-pages/shared-components/pagination';
import { ListCardViewModel } from '../../../../shared-components/list-card';
import { PaperActivitySummaryCardViewModel, PaperActivityErrorCardViewModel } from '../../../../shared-components/paper-activity-summary-card';

type NoActivity = { tag: 'no-activity-yet' };

export type OrderedArticleCards = PaginationControlsViewModel & {
  tag: 'ordered-article-cards',
  articleCards: ReadonlyArray<E.Either<PaperActivityErrorCardViewModel, PaperActivitySummaryCardViewModel>>,
};

type Feed = NoActivity | OrderedArticleCards;

export type ViewModel = {
  header: PageHeaderViewModel,
  featuredLists: ReadonlyArray<ListCardViewModel>,
  feed: Feed,
};
