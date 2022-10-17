import * as O from 'fp-ts/Option';
import { ArticleAuthors } from '../types/article-authors';
import { Doi } from '../types/doi';
import { HtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type ViewModel = {
  userId: O.Option<UserId>,
  hasUserSavedArticle: boolean,
  doi: Doi,
  title: string,
  userListUrl: O.Option<string>,
  authors: ArticleAuthors,
  fullArticleUrl: string,
  articleAbstract: HtmlFragment,
  mainContent: HtmlFragment,
  evaluationCount: number,
  latestVersion: O.Option<Date>,
  latestActivity: O.Option<Date>,
};
