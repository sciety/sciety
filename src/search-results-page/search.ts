import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
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
  TE.map((searchResults) => ({
    ...searchResults,
    items: pipe(
      searchResults.items,
      RA.map((searchResult) => ({
        ...searchResult,
        reviewCount: O.some(0),
      })),
    ),
  })),
);
