import { URL } from 'url';
import { ListId } from '../../types/list-id';
import { ArticleCardWithControlsAndAnnotationViewModel } from '../../html-pages/shared-components/article-card-with-controls-and-annotation';

export type ViewModel = {
  name: string,
  ownerName: string,
  updatedAt: Date,
  listId: ListId,
  listPageAbsoluteUrl: URL,
  articles: ReadonlyArray<ArticleCardWithControlsAndAnnotationViewModel>,
};
