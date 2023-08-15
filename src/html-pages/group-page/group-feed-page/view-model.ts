import * as E from 'fp-ts/Either';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { ArticleCardViewModel, ArticleErrorCardViewModel } from '../../../shared-components/article-card';
import { Group } from '../../../types/group';
import { PageHeaderViewModel } from '../common-components/page-header';
import { TabsViewModel } from '../common-components/tabs-view-model';

type NoActivity = { tag: 'no-activity-yet' };

export type OrderedArticleCards = { tag: 'ordered-article-cards', articleCards: RNEA.ReadonlyNonEmptyArray<E.Either<ArticleErrorCardViewModel, ArticleCardViewModel>> };

type Content = NoActivity | OrderedArticleCards;

export type ViewModel = PageHeaderViewModel & {
  group: Group,
  content: Content,
  tabs: TabsViewModel,
};
