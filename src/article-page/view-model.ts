import * as O from 'fp-ts/Option';
import { ArticleAuthors } from '../types/article-authors';
import { HtmlFragment } from '../types/html-fragment';

export type ViewModel = {
  title: string,
  authors: ArticleAuthors,
  fullArticleUrl: string,
  articleActions: {
    saveArticle: HtmlFragment,
  },
  articleAbstract: HtmlFragment,
  mainContent: HtmlFragment,
  evaluationCount: number,
  latestVersion: O.Option<Date>,
  latestActivity: O.Option<Date>,
};
