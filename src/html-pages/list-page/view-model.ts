import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { PageOfItems, LegacyPaginationControlsViewModel } from '../../shared-components/pagination';
import { ListId } from '../../types/list-id';
import { ArticleErrorCardViewModel } from '../../shared-components/article-card';
import {
  ArticleCardWithControlsAndAnnotationViewModel,
} from '../../shared-components/article-card-with-controls-and-annotation';

type Message = 'no-articles' | 'no-articles-can-be-fetched';

type ArticlesViewModel = ReadonlyArray<E.Either<
ArticleErrorCardViewModel,
ArticleCardWithControlsAndAnnotationViewModel
>>;

export type ContentWithPaginationViewModel = LegacyPaginationControlsViewModel & {
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
  subscribeHref: O.Option<string>,
  showAnnotationSuccessBanner: boolean,
};
