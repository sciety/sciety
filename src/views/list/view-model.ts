import { URL } from 'url';
import { ListId } from '../../types/list-id';
import { ArticleCardWithControlsAndAnnotationViewModel } from '../../shared-components/article-card';

export type ViewModel = {
  name: string,
  ownerName: string,
  updatedAt: Date,
  listId: ListId,
  listPageAbsoluteUrl: URL,
  articles: ReadonlyArray<ArticleCardWithControlsAndAnnotationViewModel>,
};
