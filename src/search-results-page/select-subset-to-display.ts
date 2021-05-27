import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ArticleItem, GroupItem } from './data-types';
import { LimitedSet } from './fetch-extra-details';

export type Matches = {
  query: string,
  category: string,
  groups: ReadonlyArray<GroupItem>,
  articles: {
    items: ReadonlyArray<ArticleItem>,
    total: number,
  },
};

export const selectSubsetToDisplay = (limit: number) => (state: Matches): LimitedSet => ({
  ...state,
  availableArticleMatches: state.articles.total,
  availableGroupMatches: state.groups.length,
  itemsToDisplay: pipe(
    state.category,
    (category) => ((category === 'groups')
      ? RA.takeLeft(limit)(state.groups)
      : RA.takeLeft(limit)(state.articles.items)),
  ),
});
