import * as E from 'fp-ts/Either';
import { ArticleCardViewModel, ArticleErrorCardViewModel } from '../../../shared-components/article-card/index.js';
import { PaginationControlsViewModel } from '../../../shared-components/pagination/index.js';
import { Group } from '../../../types/group.js';
import { PageHeaderViewModel } from '../common-components/page-header.js';
import { TabsViewModel } from '../common-components/tabs-view-model.js';

type NoActivity = { tag: 'no-activity-yet' };

export type OrderedArticleCards = PaginationControlsViewModel & {
  tag: 'ordered-article-cards',
  articleCards: ReadonlyArray<E.Either<ArticleErrorCardViewModel, ArticleCardViewModel>>,
};

type Content = NoActivity | OrderedArticleCards;

export type ViewModel = PageHeaderViewModel & {
  group: Group,
  content: Content,
  tabs: TabsViewModel,
};
