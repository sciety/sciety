import * as O from 'fp-ts/Option';
import { SanitisedHtmlFragment } from './sanitised-html-fragment.js';
import { ArticleAuthors } from './article-authors.js';

export type ExpressionFrontMatter = {
  abstract: O.Option<SanitisedHtmlFragment>,
  authors: ArticleAuthors,
  title: SanitisedHtmlFragment,
};
