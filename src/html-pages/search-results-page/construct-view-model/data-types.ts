import * as O from 'fp-ts/Option';
import { ArticleAuthors } from '../../../types/article-authors';
import { ArticleServer } from '../../../types/article-server';
import { Doi } from '../../../types/doi';
import { SanitisedHtmlFragment } from '../../../types/sanitised-html-fragment';

export type ArticleItem = {
  articleId: Doi,
  server: ArticleServer,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
};

export type ArticleResults = {
  items: ReadonlyArray<ArticleItem>,
  total: number,
  nextCursor: O.Option<string>,
};
