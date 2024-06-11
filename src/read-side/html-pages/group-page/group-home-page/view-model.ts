import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { Group } from '../../../../types/group';
import { ListCardViewModel } from '../../shared-components/list-card';
import { PaginationControlsViewModel } from '../../shared-components/pagination';
import { PaperActivitySummaryCardViewModel, PaperActivityErrorCardViewModel } from '../../shared-components/paper-activity-summary-card';

type NoActivity = { tag: 'no-activity-yet' };

export type OrderedArticleCards = PaginationControlsViewModel & {
  tag: 'ordered-article-cards',
  articleCards: ReadonlyArray<E.Either<PaperActivityErrorCardViewModel, PaperActivitySummaryCardViewModel>>,
};

type Feed = NoActivity | OrderedArticleCards;

export type PageHeaderViewModel = {
  group: Group,
  isFollowing: boolean,
  followerCount: number,
  groupAboutPageHref: string,
  groupListsPageHref: O.Option<string>,
  groupFollowersPageHref: string,
  managementPageHref: string,
};

export type ViewModel = {
  header: PageHeaderViewModel,
  featuredLists: ReadonlyArray<ListCardViewModel>,
  feed: Feed,
};
