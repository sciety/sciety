import { URL } from 'url';
import { ArticleCardWithControlsAndAnnotationViewModel } from '../../../html-pages/shared-components/article-card-with-controls-and-annotation';
import { ListId } from '../../../types/list-id';

export type ViewModel = {
  name: string,
  ownerName: string,
  updatedAt: Date,
  listId: ListId,
  listPageAbsoluteUrl: URL,
  articles: ReadonlyArray<ArticleCardWithControlsAndAnnotationViewModel>,
};
