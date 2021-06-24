import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe, tupled } from 'fp-ts/function';
import { ArticleItem, GroupItem, isArticleItem } from './data-types';
import { ItemViewModel, SearchResults } from './render-search-results';
import { GetAllEvents, GetGroup, populateGroupViewModel } from '../shared-components/group-card/populate-group-view-model';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';

type Ports = {
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  getAllEvents: GetAllEvents,
  getGroup: GetGroup,
  getLatestArticleVersionDate: GetLatestArticleVersionDate,
};

// TODO: Find reviewsForArticleDoi should return a TaskEither
export type FindReviewsForArticleDoi = (articleDoi: Doi) => T.Task<ReadonlyArray<{
  groupId: GroupId,
  occurredAt: Date,
}>>;

type GetLatestActivityDate = (reviews: ReadonlyArray<{ occurredAt: Date }>) => O.Option<Date>;

const getLatestActivityDate: GetLatestActivityDate = flow(
  RA.last,
  O.map(({ occurredAt }) => occurredAt),
);

type GetLatestArticleVersionDate = (articleDoi: Doi, server: ArticleServer) => TO.TaskOption<Date>;

const populateArticleViewModel = (
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  getLatestArticleVersionDate: GetLatestArticleVersionDate,
) => (item: ArticleItem) => pipe(
  T.Do,
  T.apS('reviews', pipe(item.doi, findReviewsForArticleDoi)),
  T.apS('latestVersionDate', pipe([item.doi, item.server], tupled(getLatestArticleVersionDate))),
  T.bind('latestActivityDate', ({ reviews }) => pipe(reviews, getLatestActivityDate, T.of)),
  T.bind('evaluationCount', ({ reviews }) => pipe(reviews.length, T.of)),
  T.map(({ latestVersionDate, latestActivityDate, evaluationCount }) => ({
    ...item,
    latestVersionDate,
    latestActivityDate,
    evaluationCount,
  })),
  TE.rightTask,
);

const fetchItemDetails = (ports: Ports) => (item: ArticleItem | GroupItem): TE.TaskEither<'not-found', ItemViewModel> => (
  isArticleItem(item)
    ? pipe(item, populateArticleViewModel(ports.findReviewsForArticleDoi, ports.getLatestArticleVersionDate))
    : pipe(item.id, populateGroupViewModel(ports.getGroup, ports.getAllEvents)));

export type LimitedSet = {
  query: string,
  category: string,
  availableArticleMatches: number,
  availableGroupMatches: number,
  itemsToDisplay: ReadonlyArray<GroupItem | ArticleItem>,
  nextCursor: O.Option<string>,
  pageNumber: number,
  numberOfPages: number,
};

export const fetchExtraDetails = (ports: Ports) => (state: LimitedSet): T.Task<SearchResults> => pipe(
  state.itemsToDisplay,
  T.traverseArray(fetchItemDetails(ports)),
  T.map(flow(
    RA.rights,
    (itemsToDisplay) => ({
      ...state,
      itemsToDisplay,
    }),
  )),
);
