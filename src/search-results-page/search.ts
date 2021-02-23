import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { ArticleSearchResult } from './render-search-result';
import { SearchResults } from './render-search-results';
import { Doi } from '../types/doi';

type OriginalSearchResults = {
  items: ReadonlyArray<Omit<Omit<ArticleSearchResult, '_tag'>, 'reviewCount'>>,
  total: number,
};

type FindArticles = (query: string) => TE.TaskEither<'unavailable', OriginalSearchResults>;

type GetReviewCount = (doi: Doi) => TE.TaskEither<unknown, number>;

type Search = (query: string) => TE.TaskEither<'unavailable', SearchResults>;

export const search = (findArticles: FindArticles, getReviewCount: GetReviewCount): Search => flow(
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
              getReviewCount,
              T.map(O.fromEither),
            ),
          }),
          sequenceS(T.task),
          T.map(({ searchResult, reviewCount }) => ({
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
