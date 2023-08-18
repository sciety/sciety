import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { PageOfItems, PaginationControlsViewModel } from '../../shared-components/pagination';
import { ListId } from '../../types/list-id';
import { ArticleErrorCardViewModel, ArticleCardWithControlsAndAnnotationViewModel } from '../../shared-components/article-card';

type Message = 'no-articles' | 'no-articles-can-be-fetched';

type ArticlesViewModel = ReadonlyArray<E.Either<
ArticleErrorCardViewModel,
ArticleCardWithControlsAndAnnotationViewModel
>>;

export type ContentWithPaginationViewModel = PaginationControlsViewModel & {
  articles: ArticlesViewModel,
  pagination: PageOfItems<unknown>,
};

type Content = Message | ContentWithPaginationViewModel;

export type ViewModel = {
  name: string,
  description: string,
  ownerName: string,
  ownerHref: string,
  ownerAvatarPath: string,
  articleCount: number,
  updatedAt: Date,
  editCapability: boolean,
  listId: ListId,
  basePath: string,
  content: Content,
  relatedArticlesLink: O.Option<string>,
  listPageAbsoluteUrl: URL,
};
