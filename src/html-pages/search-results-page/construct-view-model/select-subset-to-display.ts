import * as O from 'fp-ts/Option';
import { ArticleResults } from './data-types';
import { LimitedSet } from './fetch-extra-details';

type Matches = {
  query: string,
  evaluatedOnly: boolean,
  pageNumber: O.Option<number>,
  pageSize: number,
  articles: ArticleResults,
};

export const selectSubsetToDisplay = (state: Matches): LimitedSet => ({
  ...state,
  itemsToDisplay: state.articles.items,
  nextCursor: state.articles.nextCursor,
  pageNumber: O.getOrElse(() => 1)(state.pageNumber),
  numberOfPages: Math.ceil(state.articles.total / state.pageSize),
});
