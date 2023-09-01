import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { ArticleItem, GroupItem, isArticleItem } from './data-types';
import { constructGroupCardViewModel } from '../../../shared-components/group-card';
import * as DE from '../../../types/data-error';
import { ItemCardViewModel, ViewModel } from '../view-model';
import {
  ArticleErrorCardViewModel,
  constructArticleCardViewModel,
} from '../../../shared-components/article-card';
import { Dependencies } from './dependencies';
import { constructRelatedGroups } from './construct-related-groups';

const constructItemCardViewModel = (
  dependencies: Dependencies,
) => (item: ArticleItem | GroupItem): TE.TaskEither<DE.DataError | ArticleErrorCardViewModel, ItemCardViewModel> => (
  isArticleItem(item)
    ? pipe(item.articleId, constructArticleCardViewModel(dependencies))
    : pipe(item.id, constructGroupCardViewModel(dependencies), T.of));

type LimitedSetOfArticles = {
  query: string,
  evaluatedOnly: boolean,
  itemsToDisplay: ReadonlyArray<ArticleItem>,
  nextCursor: O.Option<string>,
  pageNumber: number,
  numberOfPages: number,
};

export type LimitedSet = LimitedSetOfArticles;

const toFullPageViewModelForArticlesCategory = (
  dependencies: Dependencies,
  state: LimitedSetOfArticles,
) => (itemCardViewModels: ReadonlyArray<ItemCardViewModel>) => ({
  ...state,
  relatedGroups: pipe(
    state.itemsToDisplay,
    RA.map((itemToDisplay) => itemToDisplay.articleId),
    constructRelatedGroups(dependencies),
  ),
  itemCardsToDisplay: itemCardViewModels,
  nextPageHref: pipe(
    {
      basePath: '',
      pageNumber: state.pageNumber + 1,
    },
    ({ basePath, pageNumber }) => O.some(`${basePath}page=${pageNumber}`),
  ),
});

const toFullPageViewModel = (
  dependencies: Dependencies,
  state: LimitedSet,
) => (
  itemCardViewModels: ReadonlyArray<ItemCardViewModel>,
) => toFullPageViewModelForArticlesCategory(dependencies, state)(itemCardViewModels);

export const fetchExtraDetails = (dependencies: Dependencies) => (state: LimitedSet): T.Task<ViewModel> => pipe(
  state.itemsToDisplay,
  T.traverseArray(constructItemCardViewModel(dependencies)),
  T.map(flow(
    RA.rights,
    toFullPageViewModel(dependencies, state),
  )),
);
