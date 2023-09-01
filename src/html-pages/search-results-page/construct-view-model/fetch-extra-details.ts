import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { ArticleItem } from './data-types';
import { ViewModel } from '../view-model';
import {
  constructArticleCardViewModel,
} from '../../../shared-components/article-card';
import { Dependencies } from './dependencies';
import { constructRelatedGroups } from './construct-related-groups';

type LimitedSetOfArticles = {
  query: string,
  evaluatedOnly: boolean,
  itemsToDisplay: ReadonlyArray<ArticleItem>,
  nextCursor: O.Option<string>,
  pageNumber: number,
  numberOfPages: number,
};

type LimitedSet = LimitedSetOfArticles;

const toFullPageViewModel = (
  dependencies: Dependencies,
  state: LimitedSetOfArticles,
) => (articleCards: ViewModel['articleCards']) => ({
  ...state,
  relatedGroups: pipe(
    state.itemsToDisplay,
    RA.map((itemToDisplay) => itemToDisplay.articleId),
    constructRelatedGroups(dependencies),
  ),
  articleCards,
  nextPageHref: pipe(
    {
      basePath: '',
      pageNumber: state.pageNumber + 1,
    },
    ({ basePath, pageNumber }) => O.some(`${basePath}page=${pageNumber}`),
  ),
});

export const fetchExtraDetails = (dependencies: Dependencies) => (state: LimitedSet): T.Task<ViewModel> => pipe(
  state.itemsToDisplay,
  T.traverseArray((item) => constructArticleCardViewModel(dependencies)(item.articleId)),
  T.map(flow(
    RA.rights,
    toFullPageViewModel(dependencies, state),
  )),
);
