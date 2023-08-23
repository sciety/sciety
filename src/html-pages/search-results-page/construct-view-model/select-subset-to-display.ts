import * as O from 'fp-ts/Option';
import { ArticleResults, GroupItem } from './data-types';
import { LimitedSet } from './fetch-extra-details';

export type Matches = {
  query: string,
  evaluatedOnly: boolean,
  pageNumber: O.Option<number>,
  pageSize: number,
  category: 'articles' | 'groups',
  groups: ReadonlyArray<GroupItem>,
  articles: ArticleResults,
};

export const selectSubsetToDisplay = (state: Matches): LimitedSet => {
  switch (state.category) {
    case 'groups':
      return {
        ...state,
        category: 'groups',
        availableArticleMatches: state.articles.total,
        availableGroupMatches: state.groups.length,
        itemsToDisplay: state.groups,
        nextCursor: O.none,
        pageNumber: O.getOrElse(() => 1)(state.pageNumber),
        numberOfPages: Math.ceil(state.articles.total / state.pageSize),
      };
    case 'articles':
      return {
        ...state,
        category: 'articles',
        availableArticleMatches: state.articles.total,
        availableGroupMatches: state.groups.length,
        itemsToDisplay: state.articles.items,
        nextCursor: state.articles.nextCursor,
        pageNumber: O.getOrElse(() => 1)(state.pageNumber),
        numberOfPages: Math.ceil(state.articles.total / state.pageSize),
      };
  }
};
