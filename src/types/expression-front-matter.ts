import { SanitisedHtmlFragment } from './sanitised-html-fragment';
import { ArticleAuthors } from './article-authors';

export type ExpressionFrontMatter = {
  abstract: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  title: SanitisedHtmlFragment,
};
