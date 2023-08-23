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
import { Group } from '../../../types/group';

const constructItemCardViewModel = (
  dependencies: Dependencies,
) => (item: ArticleItem | GroupItem): TE.TaskEither<DE.DataError | ArticleErrorCardViewModel, ItemCardViewModel> => (
  isArticleItem(item)
    ? pipe(item.articleId, constructArticleCardViewModel(dependencies))
    : pipe(item.id, constructGroupCardViewModel(dependencies), T.of));

type LimitedSetOfGroups = {
  query: string,
  evaluatedOnly: boolean,
  category: 'groups',
  availableArticleMatches: number,
  availableGroupMatches: number,
  itemsToDisplay: ReadonlyArray<GroupItem | ArticleItem>,
  nextCursor: O.Option<string>,
  pageNumber: number,
  numberOfPages: number,
};

type LimitedSetOfArticles = {
  query: string,
  evaluatedOnly: boolean,
  category: 'articles',
  availableArticleMatches: number,
  availableGroupMatches: number,
  itemsToDisplay: ReadonlyArray<GroupItem | ArticleItem>,
  nextCursor: O.Option<string>,
  pageNumber: number,
  numberOfPages: number,
};

export type LimitedSet = LimitedSetOfGroups | LimitedSetOfArticles;

const constructRelatedGroups = (): ViewModel['relatedGroups'] => {
  const foundGroups: ReadonlyArray<Group> = [];
  if (foundGroups.length > 0) {
    return {
      tag: 'some-related-groups',
      items: pipe(
        foundGroups,
        RA.map((foundGroup) => ({
          groupPageHref: `/groups/${foundGroup.slug}`,
          groupName: foundGroup.name,
        })),
      ),
    };
  }
  return { tag: 'no-groups-evaluated-the-found-articles' as const };
};

export const fetchExtraDetails = (dependencies: Dependencies) => (state: LimitedSet): T.Task<ViewModel> => pipe(
  state.itemsToDisplay,
  T.traverseArray(constructItemCardViewModel(dependencies)),
  T.map(flow(
    RA.rights,
    (itemCardViewModels) => ({
      ...state,
      relatedGroups: constructRelatedGroups(),
      itemCardsToDisplay: itemCardViewModels,
      nextPageHref: pipe(
        {
          basePath: '',
          pageNumber: state.pageNumber + 1,
        },
        ({ basePath, pageNumber }) => O.some(`${basePath}page=${pageNumber}`),
      ),
    }),
  )),
);
