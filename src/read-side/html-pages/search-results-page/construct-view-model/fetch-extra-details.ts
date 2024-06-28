import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { constructRelatedGroups } from './construct-related-groups';
import { Dependencies } from './dependencies';
import { ExpressionDoi } from '../../../../types/expression-doi';
import { SearchResults } from '../../../../types/search-results';
import { ArticleCardViewModel, constructArticleCard } from '../../shared-components/article-card';
import { ViewModel } from '../view-model';

type LimitedSet = {
  query: string,
  evaluatedOnly: boolean,
  itemsToDisplay: SearchResults['items'],
  nextCursor: O.Option<string>,
  pageNumber: number,
  numberOfPages: number,
};

export const constructArticleCardStackWithSilentFailures = (
  dependencies: Dependencies,
) => (
  expressionDois: ReadonlyArray<ExpressionDoi>,
): T.Task<ReadonlyArray<ArticleCardViewModel>> => pipe(
  expressionDois,
  T.traverseArray(constructArticleCard(dependencies)),
  T.map(RA.rights),
);

export const fetchExtraDetails = (dependencies: Dependencies) => (state: LimitedSet): T.Task<ViewModel> => pipe(
  state.itemsToDisplay,
  constructArticleCardStackWithSilentFailures(dependencies),
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
