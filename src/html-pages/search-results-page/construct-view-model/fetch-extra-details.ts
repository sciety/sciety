import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import * as EDOI from '../../../types/expression-doi';
import { ViewModel } from '../view-model';
import { constructPaperActivitySummaryCard } from '../../../shared-components/paper-activity-summary-card';
import { Dependencies } from './dependencies';
import { constructRelatedGroups } from './construct-related-groups';
import { ArticleId } from '../../../types/article-id';

type LimitedSet = {
  query: string,
  evaluatedOnly: boolean,
  itemsToDisplay: ReadonlyArray<ArticleId>,
  nextCursor: O.Option<string>,
  pageNumber: number,
  numberOfPages: number,
};

export const fetchExtraDetails = (dependencies: Dependencies) => (state: LimitedSet): T.Task<ViewModel> => pipe(
  state.itemsToDisplay,
  T.traverseArray((item) => pipe(
    EDOI.fromValidatedString(item.value),
    constructPaperActivitySummaryCard(dependencies),
  )),
  T.map(
    RA.rights,
  ),
  T.map(
    (paperActivitySummaryCards) => ({
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
    }),
  ),
);
