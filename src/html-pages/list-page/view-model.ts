import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { RawUserInput } from '../../read-side';
import { PaperActivityErrorCardViewModel } from '../../shared-components/paper-activity-summary-card';
import { ListId } from '../../types/list-id';
import {
  ArticleCardWithControlsAndAnnotationViewModel,
} from '../shared-components/article-card-with-controls-and-annotation';
import { PageOfItems, LegacyPaginationControlsViewModel } from '../shared-components/pagination';

type Message = 'no-articles' | 'no-articles-can-be-fetched';

type ArticlesViewModel = ReadonlyArray<E.Either<
PaperActivityErrorCardViewModel,
ArticleCardWithControlsAndAnnotationViewModel
>>;

export type ContentWithPaginationViewModel = LegacyPaginationControlsViewModel & {
  articles: ArticlesViewModel,
  pagination: PageOfItems<unknown>,
};

type Content = Message | ContentWithPaginationViewModel;

export const hasContentWithPagination = (content: Content): content is ContentWithPaginationViewModel => (
  content !== 'no-articles' && content !== 'no-articles-can-be-fetched'
);

export type ViewModel = {
  name: string,
  description: RawUserInput,
  ownerName: string,
  ownerHref: string,
  ownerAvatarSrc: string,
  imageSrc: O.Option<string>,
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
  editListDetailsHref: string,
};
