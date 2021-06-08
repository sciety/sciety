import * as O from 'fp-ts/Option';
import { ArticleResults, GroupItem } from './data-types';
import { LimitedSet } from './fetch-extra-details';

export type Matches = {
  query: string,
  pageNumber: O.Option<number>,
  pageSize: number,
  category: string,
  groups: ReadonlyArray<GroupItem>,
  articles: ArticleResults,
};

export const selectSubsetToDisplay = (state: Matches): LimitedSet => ({
  ...state,
  availableArticleMatches: state.articles.total,
  availableGroupMatches: state.groups.length,
  itemsToDisplay: (state.category === 'groups')
    ? state.groups
    : state.articles.items,
  nextCursor: (state.category === 'groups') ? O.none : state.articles.nextCursor,
  pageNumber: O.getOrElse(() => 1)(state.pageNumber),
  numberOfPages: Math.ceil(state.articles.total / state.pageSize),
});
