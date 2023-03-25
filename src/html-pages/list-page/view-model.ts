import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { ArticleViewModel } from '../../shared-components/article-card';
import { PageOfItems } from '../../shared-components/paginate';
import { HtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';
import { ArticleErrorCardViewModel } from './render-as-html/render-article-error-card';

type Message = 'no-articles' | 'no-articles-can-be-fetched';

export type ArticleCardWithControlsViewModel = {
  articleViewModel: ArticleViewModel,
  controls: boolean,
  annotationContent: O.Option<HtmlFragment>,
};

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
  lastUpdated: Date,
  editCapability: boolean,
  listId: ListId,
  basePath: string,
  contentViewModel: ContentViewModel,
};
