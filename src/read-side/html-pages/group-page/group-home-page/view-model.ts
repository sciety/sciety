import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { Group } from '../../../../types/group';
import { ArticleCardViewModel, ArticleErrorCardViewModel } from '../../shared-components/article-card';
import { ListCardViewModel } from '../../shared-components/list-card';
import { PaginationControlsViewModel } from '../../shared-components/pagination';

type NoActivity = { tag: 'no-activity-yet' };

export type OrderedArticleCards = PaginationControlsViewModel & {
  tag: 'ordered-article-cards',
  articleCards: ReadonlyArray<E.Either<ArticleErrorCardViewModel, ArticleCardViewModel>>,
};

type Feed = NoActivity | OrderedArticleCards;

export type PageHeaderViewModel = {
  group: Group,
  isFollowing: boolean,
  followerCount: number,
  groupAboutPageHref: string,
  groupListsPageHref: O.Option<string>,
  groupFollowersPageHref: string,
  managementPageHref: O.Option<string>,
};

export type ViewModel = {
  header: PageHeaderViewModel,
  featuredLists: ReadonlyArray<ListCardViewModel>,
  feed: Feed,
};
