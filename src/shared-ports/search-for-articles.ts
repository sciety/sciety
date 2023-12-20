import * as O from 'fp-ts/Option';
import { ArticleId } from '../types/article-id';

export type SearchResults = {
  items: ReadonlyArray<ArticleId>,
  total: number,
  nextCursor: O.Option<string>,
};
