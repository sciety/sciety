import { URL } from 'url';
import { PageOfItems } from '../../shared-components/paginate';
import { ListId } from '../../types/list-id';
import { ArticleCardWithControlsAndAnnotationViewModel } from '../../shared-components/article-card';

export type ContentWithPaginationViewModel = {
  articles: ReadonlyArray<ArticleCardWithControlsAndAnnotationViewModel>,
  pagination: PageOfItems<unknown>,
};

export type ViewModel = {
  name: string,
  description: string,
  ownerName: string,
  articleCount: number,
  updatedAt: Date,
  listId: ListId,
  content: ContentWithPaginationViewModel,
  listPageAbsoluteUrl: URL,
};
