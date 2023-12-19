import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import * as EDOI from '../../../types/expression-doi';
import { ArticleItem } from './data-types';
import { ViewModel } from '../view-model';
import { constructArticleCard } from '../../../shared-components/paper-activity-summary-card';
import { Dependencies } from './dependencies';
import { constructRelatedGroups } from './construct-related-groups';

type LimitedSet = {
  query: string,
  evaluatedOnly: boolean,
  itemsToDisplay: ReadonlyArray<ArticleItem>,
  nextCursor: O.Option<string>,
  pageNumber: number,
  numberOfPages: number,
};

export const fetchExtraDetails = (dependencies: Dependencies) => (state: LimitedSet): T.Task<ViewModel> => pipe(
  state.itemsToDisplay,
  T.traverseArray((item) => constructArticleCard(dependencies)(EDOI.fromValidatedString(item.articleId.value))),
  T.map(
    RA.rights,
  ),
  T.map(
    (paperActivitySummaryCards) => ({
      ...state,
      relatedGroups: pipe(
        state.itemsToDisplay,
        RA.map((itemToDisplay) => itemToDisplay.articleId),
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
