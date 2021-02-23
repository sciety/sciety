import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { ArticleSearchResult } from './render-search-result';
import { SearchResults } from './render-search-results';

type OriginalSearchResults = {
  items: ReadonlyArray<Omit<Omit<ArticleSearchResult, '_tag'>, 'reviewCount'>>,
  total: number,
};

type FindArticles = (query: string) => TE.TaskEither<'unavailable', OriginalSearchResults>;

type Search = (query: string) => TE.TaskEither<'unavailable', SearchResults>;

export const search = (findArticles: FindArticles): Search => flow(
  findArticles,
  TE.chainW(flow(
    (searchResults) => ({
      total: T.of(searchResults.total),
      items: pipe(
        searchResults.items,
        T.traverseArray(flow(
          (searchResult) => ({
            searchResult: T.of(searchResult),
            reviewCount: T.of(O.some(0)),
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
