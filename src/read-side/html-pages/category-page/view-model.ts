import { ArticleCardViewModel } from '../shared-components/article-card';

export type ViewModel = {
  pageHeading: string,
  categoryContent: ReadonlyArray<ArticleCardViewModel>,
};
