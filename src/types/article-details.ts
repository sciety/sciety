import { ArticleAuthors } from './article-authors';
import { ArticleServer } from './article-server';
import { Doi } from './doi';
import { SanitisedHtmlFragment } from './sanitised-html-fragment';

export type ArticleDetails = {
  abstract: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  doi: Doi,
  title: SanitisedHtmlFragment,
  server: ArticleServer,
};
