import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { ArticleSearchResult } from './render-search-result';
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

export const search = (findArticles: FindArticles, findReviewsForArticleDoi: FindReviewsForArticleDoi): Search => flow(
  findArticles,
  TE.chainW(flow(
    (searchResults) => ({
      total: T.of(searchResults.total),
      items: pipe(
        searchResults.items,
        T.traverseArray(flow(
          (searchResult) => ({
            searchResult: T.of(searchResult),
            reviewCount: pipe(
              searchResult.doi,
              findReviewsForArticleDoi,
              T.map((list) => list.length),
              T.map(O.some), // TODO: should be O.fromPredicate
            ),
          }),
          sequenceS(T.task),
          T.map(({ searchResult, reviewCount }) => ({
            _tag: 'Article' as const,
            ...searchResult,
            reviewCount,
          })),
        )),
      ),
    }),
    sequenceS(T.task),
    TE.rightTask,
  )),
);
