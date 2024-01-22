import * as O from 'fp-ts/Option';
import { SanitisedHtmlFragment } from './sanitised-html-fragment';
import { ArticleAuthors } from './article-authors';

export type ExpressionFrontMatter = {
  abstract: O.Option<SanitisedHtmlFragment>,
  authors: ArticleAuthors,
  title: SanitisedHtmlFragment,
};
