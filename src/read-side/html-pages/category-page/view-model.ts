import { ArticlesListViewModel } from './render-articles-list';

export type ViewModel = {
  pageHeading: string,
  categoryContent: ArticlesListViewModel,
};
