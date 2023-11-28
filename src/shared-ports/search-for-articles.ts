import * as O from 'fp-ts/Option';
import { ArticleAuthors } from '../types/article-authors';
import { ArticleServer } from '../types/article-server';
import { ArticleId } from '../types/article-id';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

type SearchResult = {
  articleId: ArticleId,
  server: ArticleServer,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
};

export type SearchResults = {
  items: ReadonlyArray<SearchResult>,
  total: number,
  nextCursor: O.Option<string>,
};
