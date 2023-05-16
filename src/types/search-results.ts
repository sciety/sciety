import * as O from 'fp-ts/Option';
import { ArticleAuthors } from './article-authors';
import { ArticleServer } from './article-server';
import { Doi } from './doi';
import { SanitisedHtmlFragment } from './sanitised-html-fragment';

type SearchResult = {
  articleId: Doi,
  server: ArticleServer,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
};

export type SearchResults = {
  items: ReadonlyArray<SearchResult>,
  total: number,
  nextCursor: O.Option<string>,
};
