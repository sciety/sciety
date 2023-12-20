import * as O from 'fp-ts/Option';
import { ArticleId } from '../types/article-id';

type SearchResult = {
  articleId: ArticleId,
};

export type SearchResults = {
  items: ReadonlyArray<SearchResult>,
  total: number,
  nextCursor: O.Option<string>,
};
