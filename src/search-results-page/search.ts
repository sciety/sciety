import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { ArticleSearchResult, SearchResult } from './render-search-result';
import { SearchResults } from './render-search-results';
import { Doi } from '../types/doi';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { ReviewId } from '../types/review-id';

type OriginalSearchResults = {
  items: ReadonlyArray<Omit<Omit<ArticleSearchResult, '_tag'>, 'reviewCount'>>,
  total: number,
};

type FindArticles = (query: string) => TE.TaskEither<'unavailable', OriginalSearchResults>;

export type FindReviewsForArticleDoi = (articleDoi: Doi) => T.Task<ReadonlyArray<{
  reviewId: ReviewId,
  editorialCommunityId: EditorialCommunityId,
}>>;

type Search = (query: string) => TE.TaskEither<'unavailable', SearchResults>;

const addPeerJHardcodedResult = (
  query: string,
) => (
  searchResults: SearchResults,
): SearchResults => {
  if (query === 'peerj') {
    const hardcodedSearchResult = {
      _tag: 'Group' as const,
      link: '/groups/53ed5364-a016-11ea-bb37-0242ac130002',
      name: 'PeerJ',
    };
    return {
      total: searchResults.total + 1,
      items: RA.cons<SearchResult>(hardcodedSearchResult)(searchResults.items),
    };
  }
  return searchResults;
};

export const search = (
  findArticles: FindArticles,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
): Search => (query: string) => pipe(
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
  TE.map(addPeerJHardcodedResult(query)),
);
