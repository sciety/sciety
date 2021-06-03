import * as O from 'fp-ts/Option';
import { ArticleItem, GroupItem } from './data-types';
import { LimitedSet } from './fetch-extra-details';

export type Matches = {
  query: string,
  pageSize: number,
  category: string,
  groups: ReadonlyArray<GroupItem>,
  articles: {
    items: ReadonlyArray<ArticleItem>,
    total: number,
    nextCursor: O.Option<string>,
  },
};

export const selectSubsetToDisplay = (state: Matches): LimitedSet => ({
  ...state,
  availableArticleMatches: state.articles.total,
  availableGroupMatches: state.groups.length,
  itemsToDisplay: (state.category === 'groups')
    ? state.groups
    : state.articles.items,
  nextCursor: (state.category === 'groups') ? O.none : state.articles.nextCursor,
});
