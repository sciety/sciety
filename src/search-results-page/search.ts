import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { ArticleSearchResult } from './render-search-result';
import { SearchResults } from './render-search-results';
import { Doi } from '../types/doi';
import { DomainEvent } from '../types/domain-events';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { toHtmlFragment } from '../types/html-fragment';
import { ReviewId } from '../types/review-id';
import { sanitise } from '../types/sanitised-html-fragment';

type MatchedArticle = Omit<Omit<ArticleSearchResult, '_tag'>, 'reviewCount'>;

type OriginalSearchResults = {
  items: ReadonlyArray<MatchedArticle>,
  total: number,
};

export type GetGroup = (editorialCommunityId: GroupId) => T.Task<O.Option<Group>>;
export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;
type FindArticles = (query: string) => TE.TaskEither<'unavailable', OriginalSearchResults>;
type FindGroups = (query: string) => T.Task<ReadonlyArray<GroupId>>;
type ProjectGroupMeta = (groupId: GroupId) => {
  reviewCount: number,
  followerCount: number,
};

type Search = (query: string) => TE.TaskEither<'unavailable', SearchResults>;

const constructGroupResult = (getGroup: GetGroup, projectGroupMeta: ProjectGroupMeta) => (groupId: GroupId) => pipe(
  groupId,
  getGroup,
  T.map(E.fromOption(() => 'not-found')),
  TE.chainW((group) => pipe(
    group.id,
    projectGroupMeta,
    (meta) => ({
      ...group,
      ...meta,
      _tag: 'Group' as const,
      description: sanitise(toHtmlFragment(group.shortDescription)),
    }),
    TE.right,
  )),
);

const getGroupResults = (
  getGroup: GetGroup,
  projectGroupMeta: ProjectGroupMeta,
  findGroups: FindGroups,
) => flow(
  findGroups,
  T.chain(T.traverseArray(constructGroupResult(getGroup, projectGroupMeta))),
  T.map(RA.rights),
);

const addGroupResults = (
  getGroup: GetGroup,
  projectGroupMeta: ProjectGroupMeta,
  findGroups: FindGroups,
) => (
  query: string,
) => (
  searchResults: SearchResults,
): TE.TaskEither<never, SearchResults> => pipe(
  query,
  getGroupResults(getGroup, projectGroupMeta, findGroups),
  T.map((groupSearchResults) => ({
    total: searchResults.total + groupSearchResults.length,
    items: [...groupSearchResults, ...searchResults.items],
  })),
  T.map(E.right),
);

export type FindReviewsForArticleDoi = (articleDoi: Doi) => T.Task<ReadonlyArray<{
  reviewId: ReviewId,
  editorialCommunityId: GroupId,
}>>;

const toArticleViewModel = (
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
) => (matchedArticle: MatchedArticle) => pipe(
  matchedArticle.doi,
  findReviewsForArticleDoi,
  T.map((reviews) => ({
    _tag: 'Article' as const,
    ...matchedArticle,
    reviewCount: reviews.length,
  })),
);

export const search = (
  findArticles: FindArticles,
  findGroups: FindGroups,
  getGroup: GetGroup,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  projectGroupMeta: ProjectGroupMeta,
): Search => (query) => pipe(
  query,
  findArticles,
  TE.chainW(flow(
    (searchResults) => pipe(
      searchResults.items,
      T.traverseArray(toArticleViewModel(findReviewsForArticleDoi)),
      T.map((items) => ({
        total: searchResults.total,
        items,
      })),
    ),
    TE.rightTask,
  )),
  TE.chainW(addGroupResults(getGroup, projectGroupMeta, findGroups)(query)),
);
