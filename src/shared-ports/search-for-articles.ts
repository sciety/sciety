import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { ArticleAuthors } from '../types/article-authors.js';
import { ArticleServer } from '../types/article-server.js';
import * as DE from '../types/data-error.js';
import { ArticleId } from '../types/article-id.js';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment.js';

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

export type SearchForArticles = (
  pageSize: number,
) => (query: string, cursor: O.Option<string>, evaluatedOnly: boolean) => TE.TaskEither<DE.DataError, SearchResults>;
