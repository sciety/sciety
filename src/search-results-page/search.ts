import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { ArticleSearchResult, SearchResult } from './render-search-result';
import { SearchResults } from './render-search-results';
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

const addPeerJHardcodedResult = (
  query: string,
) => (
  searchResults: SearchResults,
) => {
  if (query === 'peerj') {
    const hardcodedSearchResult = {
      _tag: 'Group' as const,
      link: '/groups/53ed5364-a016-11ea-bb37-0242ac130002',
      name: 'PeerJ',
      description: pipe(
        'PeerJ is an open access publisher of 7 peer-reviewed journals, and an editorial community of over 2000 Academic Editors and Advisors, and tens of thousands of authors and reviewers.',
        toHtmlFragment,
        sanitise,
      ),
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
  TE.map(addPeerJHardcodedResult(query)),
);
