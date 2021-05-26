import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe, tupled } from 'fp-ts/function';
import { ArticleItem, GroupItem, isArticleItem } from './data-types';
import { ItemViewModel, SearchResults } from './render-search-results';
import { updateGroupMeta } from './update-group-meta';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { DomainEvent } from '../types/domain-events';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { toHtmlFragment } from '../types/html-fragment';
import { ReviewId } from '../types/review-id';
import { sanitise } from '../types/sanitised-html-fragment';

type Ports = {
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  getAllEvents: GetAllEvents,
  getGroup: GetGroup,
  getLatestArticleVersionDate: GetLatestArticleVersionDate,
};

export type GetGroup = (groupId: GroupId) => TO.TaskOption<Group>;

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

// TODO: Find reviewsForArticleDoi should return a TaskEither
export type FindReviewsForArticleDoi = (articleDoi: Doi) => T.Task<ReadonlyArray<{
  reviewId: ReviewId,
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

const populateGroupViewModel = (getGroup: GetGroup, getAllEvents: GetAllEvents) => flow(
  (item: GroupItem) => item.id,
  getGroup,
  T.map(E.fromOption(() => 'not-found' as const)),
  TE.chainTaskK((group) => pipe(
    getAllEvents,
    T.map(RA.reduce({ reviewCount: 0, followerCount: 0 }, updateGroupMeta(group.id))),
    T.map((meta) => ({
      ...group,
      ...meta,
      description: pipe(group.shortDescription, toHtmlFragment, sanitise),
    })),
  )),
);
const fetchItemDetails = (ports: Ports) => (item: ArticleItem | GroupItem): TE.TaskEither<'not-found', ItemViewModel> => (
  isArticleItem(item)
    ? pipe(item, populateArticleViewModel(ports.findReviewsForArticleDoi, ports.getLatestArticleVersionDate))
    : pipe(item, populateGroupViewModel(ports.getGroup, ports.getAllEvents)));

export type LimitedSet = {
  query: string,
  category: string,
  availableMatches: number,
  availableArticleMatches: number,
  availableGroupMatches: number,
  itemsToDisplay: ReadonlyArray<GroupItem | ArticleItem>,
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
