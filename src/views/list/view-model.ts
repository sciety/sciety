import { URL } from 'url';
import { ListId } from '../../types/list-id.js';
import { ArticleCardWithControlsAndAnnotationViewModel } from '../../shared-components/article-card-with-controls-and-annotation/index.js';

export type ViewModel = {
  name: string,
  ownerName: string,
  updatedAt: Date,
  listId: ListId,
  listPageAbsoluteUrl: URL,
  articles: ReadonlyArray<ArticleCardWithControlsAndAnnotationViewModel>,
};
