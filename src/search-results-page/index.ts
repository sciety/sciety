import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { ArticleItem, GroupItem, MatchedArticle } from './data-types';
import { renderErrorPage, RenderPage, renderPage } from './render-page';
import { ArticleViewModel, GroupViewModel, ItemViewModel } from './render-search-result';
import { SearchResults } from './render-search-results';
import { updateGroupMeta } from './update-group-meta';
import { Doi } from '../types/doi';
import { DomainEvent } from '../types/domain-events';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { toHtmlFragment } from '../types/html-fragment';
import { ReviewId } from '../types/review-id';
import { sanitise } from '../types/sanitised-html-fragment';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

type Matches = {
  query: string,
  groups: ReadonlyArray<GroupItem>,
  articles: {
    items: ReadonlyArray<ArticleItem>,
    total: number,
  },
};

const selectSubsetToDisplay = (limit: number) => (state: Matches): LimitedSet => ({
  ...state,
  availableMatches: state.groups.length + state.articles.total,
  itemsToDisplay: pipe(
    [...state.groups, ...state.articles.items],
    RA.takeLeft(limit),
  ),
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

type GetGroup = (editorialCommunityId: GroupId) => T.Task<O.Option<Group>>;

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type FindReviewsForArticleDoi = (articleDoi: Doi) => T.Task<ReadonlyArray<{
  reviewId: ReviewId,
  editorialCommunityId: GroupId,
}>>;

const fetchItemDetails = (ports: Ports) => (item: GroupItem | ArticleItem): TE.TaskEither<'not-found', GroupViewModel | ArticleViewModel> => {
  if (item._tag === 'Article') {
    return pipe(
      item.doi,
      ports.findReviewsForArticleDoi, // TODO: Find reviewsForArticleDoi should return a TaskEither
      T.map((reviews) => ({
        ...item,
        reviewCount: reviews.length,
      })),
      (f) => TE.rightTask<'not-found', ItemViewModel>(f),
    );
  }

  return pipe(
    item.id,
    ports.getGroup,
    T.map(E.fromOption(() => 'not-found' as const)),
    TE.chainW((group) => pipe(
      ports.getAllEvents,
      T.map(RA.reduce({ reviewCount: 0, followerCount: 0 }, updateGroupMeta(group.id))),
      T.map((meta) => ({
        ...group,
        ...meta,
        _tag: 'Group' as const,
        description: sanitise(toHtmlFragment(group.shortDescription)),
      })),
      TE.rightTask,
    )),
  );
};

type LimitedSet = {
  query: string,
  availableMatches: number,
  itemsToDisplay: ReadonlyArray<GroupItem | ArticleItem>,
};

const fetchExtraDetails = (ports: Ports) => (state: LimitedSet): TE.TaskEither<never, SearchResults> => pipe(
  state.itemsToDisplay,
  T.traverseArray(fetchItemDetails(ports)),
  T.map(RA.rights),
  T.map((itemsToDisplay) => ({
    ...state,
    itemsToDisplay,
  })),
  TE.rightTask,
);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

type FindGroups = (q: string) => T.Task<ReadonlyArray<GroupId>>;

type FindMatchingGroups = (fg: FindGroups) => (q: string) => TE.TaskEither<never, ReadonlyArray<GroupItem>>;

const findMatchingGroups: FindMatchingGroups = (findGroups) => flow(
  findGroups, // TODO: should only ask for 10 of n; should return a TE
  T.map(RA.map((groupId) => ({
    _tag: 'Group' as const,
    id: groupId,
  }))),
  TE.rightTask,
);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

type FindArticles = (query: string) => TE.TaskEither<'unavailable', {
  items: ReadonlyArray<MatchedArticle>,
  total: number,
}>;

const findMatchingArticles = (findArticles: FindArticles) => flow(
  findArticles,
  TE.map((results) => ({
    ...results,
    items: results.items.map((article) => ({
      _tag: 'Article' as const,
      ...article,
    })),
  })),
);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

type Ports = {
  findGroups: FindGroups,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  getAllEvents: GetAllEvents,
  getGroup: GetGroup,
  searchEuropePmc: FindArticles,
};

type Params = {
  query: string,
};

type SearchResultsPage = (params: Params) => ReturnType<RenderPage>;

export const searchResultsPage = (ports: Ports): SearchResultsPage => (params) => pipe(
  {
    query: TE.right(params.query),
    articles: findMatchingArticles(ports.searchEuropePmc)(params.query),
    groups: findMatchingGroups(ports.findGroups)(params.query),
  },
  sequenceS(TE.taskEither),
  TE.map(selectSubsetToDisplay(10)),
  TE.chainW(fetchExtraDetails(ports)),
  TE.bimap(renderErrorPage, renderPage),
);
