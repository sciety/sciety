import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { projectGroupMeta } from './project-group-meta';
import { ArticleSearchResult } from './render-search-result';
import { SearchResults } from './render-search-results';
import { bootstrapEditorialCommunities } from '../data/bootstrap-editorial-communities';
import { Doi } from '../types/doi';
import { DomainEvent } from '../types/domain-events';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { toHtmlFragment } from '../types/html-fragment';
import { ReviewId } from '../types/review-id';
import { sanitise } from '../types/sanitised-html-fragment';

type OriginalSearchResults = {
  items: ReadonlyArray<Omit<Omit<ArticleSearchResult, '_tag'>, 'reviewCount'>>,
  total: number,
};

export type GetGroup = (editorialCommunityId: GroupId) => T.Task<O.Option<Group>>;
export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;
type FindArticles = (query: string) => TE.TaskEither<'unavailable', OriginalSearchResults>;

export type FindReviewsForArticleDoi = (articleDoi: Doi) => T.Task<ReadonlyArray<{
  reviewId: ReviewId,
  editorialCommunityId: GroupId,
}>>;

type Search = (query: string) => TE.TaskEither<'unavailable', SearchResults>;

const constructGroupResult = (getGroup: GetGroup, getAllEvents: GetAllEvents) => (groupId: GroupId) => pipe(
  groupId,
  getGroup,
  T.map(E.fromOption(() => 'not-found')),
  TE.chainW((group) => pipe(
    getAllEvents,
    T.map(projectGroupMeta(groupId)),
    T.map((meta) => ({
      ...group,
      ...meta,
      _tag: 'Group' as const,
      description: sanitise(toHtmlFragment(group.shortDescription)),
    })),
    T.map(E.right),
  )),
);

export type FetchStaticFile = (filename: string) => TE.TaskEither<'not-found' | 'unavailable', string>;

type SearchableGroupFields = Group & { description: string };

const normalize = (string: string) => string.toLowerCase();

const normalizedIncludes = (searchable: string, query: string) => pipe(
  searchable,
  normalize,
  (normalized) => normalized.includes(query),
);

const includesQuery = (query: string) => (group: SearchableGroupFields) => pipe(
  query,
  normalize,
  (normalizedQuery) => (
    normalizedIncludes(group.name, normalizedQuery)
    || normalizedIncludes(group.shortDescription, normalizedQuery)
    || normalizedIncludes(group.description, normalizedQuery)
  ),
);

const findGroups = (fetchStaticFile: FetchStaticFile) => (query: string): T.Task<ReadonlyArray<GroupId>> => pipe(
  bootstrapEditorialCommunities,
  T.traverseArray((group) => pipe(
    `groups/${group.descriptionPath}`,
    fetchStaticFile,
    T.map(E.getOrElse(constant(''))),
    T.map((description) => ({
      ...group,
      description,
    })),
  )),
  T.map(flow(
    RA.filter(includesQuery(query)),
    RA.map((group) => group.id),
  )),
);

const dropErrorResults = flow(
  RA.separate,
  ({ right }) => right,
);

const addGroupResults = (
  getGroup: GetGroup,
  getAllEvents: GetAllEvents,
  fetchStaticFile: FetchStaticFile,
) => (
  query: string,
) => (
  searchResults: SearchResults,
): TE.TaskEither<never, SearchResults> => pipe(
  query,
  findGroups(fetchStaticFile),
  T.chain(flow(
    T.traverseArray(constructGroupResult(getGroup, getAllEvents)),
    T.map(dropErrorResults),
  )),
  T.map((hardcodedSearchResults) => ({
    total: searchResults.total + hardcodedSearchResults.length,
    items: [...hardcodedSearchResults, ...searchResults.items],
  })),
  T.map(E.right),
);

export const search = (
  findArticles: FindArticles,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  getGroup: GetGroup,
  getAllEvents: GetAllEvents,
  fetchStaticFile: FetchStaticFile,
): Search => (query) => pipe(
  query,
  findArticles,
  TE.chainW(flow(
    (searchResults) => pipe(
      searchResults.items,
      T.traverseArray((searchResult) => pipe(
        searchResult,
        ({ doi }) => pipe(
          doi,
          findReviewsForArticleDoi,
          T.map((list) => list.length),
        ),
        T.map((reviewCount) => ({
          _tag: 'Article' as const,
          ...searchResult,
          reviewCount,
        })),
      )),
      T.map((items) => ({
        total: searchResults.total,
        items,
      })),
    ),
    TE.rightTask,
  )),
  TE.chainW(addGroupResults(getGroup, getAllEvents, fetchStaticFile)(query)),
);
