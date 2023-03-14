import { ViewModel as HeaderViewModel } from './render-as-html/render-header';
import { ContentWithPaginationViewModel } from './articles-list/render-content-with-pagination';

type Message = 'no-articles' | 'no-articles-can-be-fetched';

export type ContentViewModel = Message | ContentWithPaginationViewModel;

export type ViewModel = {
  title: string,
  basePath: string,
  contentViewModel: ContentViewModel,
} & HeaderViewModel;
