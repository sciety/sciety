import { SanitisedHtmlFragment } from './sanitised-html-fragment';
import { ArticleAuthors } from './article-authors';
import { ArticleServer } from './article-server';

export type ExpressionFrontMatter = {
  abstract: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  title: SanitisedHtmlFragment,
  server: ArticleServer,
};
