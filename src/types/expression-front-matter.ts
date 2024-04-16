import * as O from 'fp-ts/Option';
import { ArticleAuthors } from './article-authors';
import { SanitisedHtmlFragment } from './sanitised-html-fragment';

export type ExpressionFrontMatter = {
  abstract: O.Option<SanitisedHtmlFragment>,
  authors: ArticleAuthors,
  title: SanitisedHtmlFragment,
};
