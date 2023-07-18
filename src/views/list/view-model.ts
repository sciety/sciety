import { URL } from 'url';
import * as O from 'fp-ts/Option';
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
  ownerHref: string,
  ownerAvatarPath: string,
  articleCount: number,
  updatedAt: Date,
  listId: ListId,
  basePath: string,
  content: ContentWithPaginationViewModel,
  relatedArticlesLink: O.Option<string>,
  listPageAbsoluteUrl: URL,
};
