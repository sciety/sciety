import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { ArticleSearchResult } from './render-search-result';
import { SearchResults } from './render-search-results';
import { bootstrapEditorialCommunities } from '../data/bootstrap-editorial-communities';
import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';
import { toHtmlFragment } from '../types/html-fragment';
import { ReviewId } from '../types/review-id';
import { sanitise } from '../types/sanitised-html-fragment';

type OriginalSearchResults = {
  items: ReadonlyArray<Omit<Omit<ArticleSearchResult, '_tag'>, 'reviewCount'>>,
  total: number,
};

type FindArticles = (query: string) => TE.TaskEither<'unavailable', OriginalSearchResults>;

export type FindReviewsForArticleDoi = (articleDoi: Doi) => T.Task<ReadonlyArray<{
  reviewId: ReviewId,
  editorialCommunityId: GroupId,
}>>;

type Search = (query: string) => TE.TaskEither<'unavailable', SearchResults>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getDescription = (groupId: GroupId) => pipe(
  bootstrapEditorialCommunities,
  RA.lookup(2),
  O.chain(flow((group) => group.shortDescription, O.fromNullable)),
  O.getOrElse(constant('')),
  toHtmlFragment,
  sanitise,
);

const constructGroupResult = () => ({
  _tag: 'Group' as const,
  link: '/groups/53ed5364-a016-11ea-bb37-0242ac130002',
  name: 'PeerJ',
  description: getDescription(new GroupId('53ed5364-a016-11ea-bb37-0242ac130002')),
  avatarPath: '/static/groups/peerj--53ed5364-a016-11ea-bb37-0242ac130002.jpg',
  followerCount: 47,
  reviewCount: 835,
});

const findGroups = (query: string): ReadonlyArray<GroupId> => pipe(
  query,
  O.fromPredicate((q) => q === 'peerj'),
  O.fold(
    constant([]),
    constant([new GroupId('53ed5364-a016-11ea-bb37-0242ac130002')]),
  ),
);

const addGroupResults = (
  query: string,
) => (
  searchResults: SearchResults,
) => pipe(
  query,
  findGroups,
  RA.map(constructGroupResult),
  (hardcodedSearchResults) => ({
    total: searchResults.total + hardcodedSearchResults.length,
    items: [...hardcodedSearchResults, ...searchResults.items],
  }),
);

export const search = (
  findArticles: FindArticles,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
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
          T.map(O.some), // TODO: should be O.fromPredicate
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
  TE.map(addGroupResults(query)),
);
