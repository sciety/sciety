import { ArticleAuthors } from '../types/article-authors';
import { HtmlFragment } from '../types/html-fragment';

export type ViewModel = {
  title: string,
  authors: ArticleAuthors,
  articleActions: HtmlFragment,
  articleAbstract: HtmlFragment,
  mainContent: HtmlFragment,
};
