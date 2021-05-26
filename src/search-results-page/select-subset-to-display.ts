import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ArticleItem, GroupItem } from './data-types';
import { LimitedSet } from './fetch-extra-details';

export type Matches = {
  query: string,
  category: O.Option<string>,
  groups: ReadonlyArray<GroupItem>,
  articles: {
    items: ReadonlyArray<ArticleItem>,
    total: number,
  },
};

export const selectSubsetToDisplay = (limit: number) => (state: Matches): LimitedSet => ({
  ...state,
  category: pipe(
    state.category,
    O.fold(
      () => 'articles',
      (category) => category,
    ),
  ),
  availableMatches: state.groups.length + state.articles.total,
  availableArticleMatches: state.articles.total,
  availableGroupMatches: state.groups.length,
  itemsToDisplay: pipe(
    state.category,
    O.fold(
      () => [...state.groups, ...state.articles.items],
      (category) => ((category === 'groups') ? [...state.groups] : [...state.articles.items]),
    ),
    RA.takeLeft(limit),
  ),
});
