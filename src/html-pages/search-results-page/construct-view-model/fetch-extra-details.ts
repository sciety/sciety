import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { constructRelatedGroups } from './construct-related-groups';
import { Dependencies } from './dependencies';
import { constructPaperActivitySummaryCard } from '../../../shared-components/paper-activity-summary-card';
import { SearchResults } from '../../../types/search-results';
import { ViewModel } from '../view-model';

type LimitedSet = {
  query: string,
  evaluatedOnly: boolean,
  itemsToDisplay: SearchResults['items'],
  nextCursor: O.Option<string>,
  pageNumber: number,
  numberOfPages: number,
};

export const fetchExtraDetails = (dependencies: Dependencies) => (state: LimitedSet): T.Task<ViewModel> => pipe(
  state.itemsToDisplay,
  T.traverseArray(constructPaperActivitySummaryCard(dependencies)),
  T.map(RA.rights),
  T.map((paperActivitySummaryCards) => ({
    ...state,
    relatedGroups: pipe(
      state.itemsToDisplay,
      constructRelatedGroups(dependencies),
    ),
    paperActivitySummaryCards,
    nextPageHref: pipe(
      {
        basePath: '',
        pageNumber: state.pageNumber + 1,
      },
      ({ basePath, pageNumber }) => O.some(`${basePath}page=${pageNumber}`),
    ),
  })),
);
