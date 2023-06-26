import * as E from 'fp-ts/Either';
import { PageOfItems } from '../../shared-components/paginate';
import { ListId } from '../../types/list-id';
import { ArticleErrorCardViewModel } from '../../shared-components/article-card/render-article-error-card';
import { ArticleCardWithControlsViewModel } from '../../shared-components/article-card/render-article-card';

type Message = 'no-articles' | 'no-articles-can-be-fetched';

export type ArticlesViewModel = ReadonlyArray<E.Either<ArticleErrorCardViewModel, ArticleCardWithControlsViewModel>>;

export type ContentWithPaginationViewModel = {
  articles: ArticlesViewModel,
  pagination: PageOfItems<unknown>,
};

export type ContentViewModel = Message | ContentWithPaginationViewModel;

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
  contentViewModel: ContentViewModel,
};
