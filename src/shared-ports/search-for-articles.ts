import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { ArticleAuthors } from '../types/article-authors';
import { ArticleServer } from '../types/article-server';
import * as DE from '../types/data-error';
import { Doi } from '../types/doi';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

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

export type SearchForArticles = (
  pageSize: number,
) => (query: string, cursor: O.Option<string>, evaluatedOnly: boolean) => TE.TaskEither<DE.DataError, SearchResults>;
