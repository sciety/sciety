import { sequenceS } from 'fp-ts/Apply';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { FetchStaticFile, findGroups } from './find-groups';
import { projectGroupMeta } from './project-group-meta';
import { renderErrorPage, RenderPage, renderPage } from './render-page';
import { ArticleViewModel, GroupViewModel, ItemViewModel } from './render-search-result';
import { SearchResults } from './render-search-results';
import {
  constructGroupResult,
  FindReviewsForArticleDoi,
  GetAllEvents, GetGroup, MatchedArticle, toArticleViewModel,
} from './search';
import { bootstrapEditorialCommunities } from '../data/bootstrap-editorial-communities';
import { Doi } from '../types/doi';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';

type ArticleSearchResults = {
  items: ReadonlyArray<MatchedArticle>,
  total: number,
};

type FindArticles = (query: string) => TE.TaskEither<'unavailable', ArticleSearchResults>;

type Ports = {
  searchEuropePmc: FindArticles,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  getGroup: GetGroup,
  getAllEvents: GetAllEvents,
  fetchStaticFile: FetchStaticFile,
};

type Params = {
  query: string,
};

type Matches = {
  query: string,
  groups: ReadonlyArray<GroupItem>,
  articles: {
    items: ReadonlyArray<ArticleItem>,
    total: number,
  },
};

type GroupItem = {
  _tag: 'Group',
  id: GroupId,
};

type ArticleItem = {
  _tag: 'Article',
  doi: Doi,
  title: string,
  authors: string,
  postedDate: Date,
};

type LimitedSet = {
  query: string,
  availableMatches: number,
  itemsToDisplay: ReadonlyArray<GroupItem | ArticleItem>,
};

const selectSubsetToDisplay = (limit: number) => (state: Matches): LimitedSet => ({
  ...state,
  availableMatches: state.groups.length + state.articles.total,
  itemsToDisplay: pipe(
    [...state.groups, ...state.articles.items],
    RA.takeLeft(limit),
  ),
});

type SearchResultsPage = (params: Params) => ReturnType<RenderPage>;

const fetchItemDetails = (ports: Ports) => (item: GroupItem | ArticleItem): TE.TaskEither<'not-found', GroupViewModel | ArticleViewModel> => {
  if (item._tag === 'Article') {
    return pipe(
      item,
      // TODO: Find reviewsForArticleDoi should return a TaskEither
      toArticleViewModel(ports.findReviewsForArticleDoi),
      (f) => TE.rightTask<'not-found', ItemViewModel>(f),
    );
  }
  return pipe(
    item.id,
    constructGroupResult(ports.getGroup, projectGroupMeta(ports.getAllEvents)),
  );
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

type FindMatchingGroups = (
  fsf: FetchStaticFile, b: RNEA.ReadonlyNonEmptyArray<Group>,
) => (q: string) => TE.TaskEither<never, ReadonlyArray<{
  _tag: 'Group',
  id: GroupId,
}>>;

const findMatchingGroups: FindMatchingGroups = (fetchStaticFile, allGroups) => flow(
  findGroups(fetchStaticFile, allGroups), // TODO: should only ask for 10 of n
  T.map(RA.map((groupId) => ({
    _tag: 'Group' as const,
    id: groupId,
  }))),
  TE.rightTask,
);

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

export const searchResultsPage = (ports: Ports): SearchResultsPage => (params) => pipe(
  {
    query: TE.right(params.query),
    articles: findMatchingArticles(ports.searchEuropePmc)(params.query),
    groups: findMatchingGroups(ports.fetchStaticFile, bootstrapEditorialCommunities)(params.query),
  },
  sequenceS(TE.taskEither),
  TE.map(selectSubsetToDisplay(10)),
  TE.chainW(fetchExtraDetails(ports)),
  TE.bimap(renderErrorPage, renderPage),
);
