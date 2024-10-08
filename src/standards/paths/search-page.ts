import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';

export const searchPagePath = '/search';

export const searchResultsPagePath = '/search';

export const constructSearchPageHref = (
  nextCursor: O.Option<string>,
  query: string,
  includeUnevaluatedPreprints: boolean,
  pageNumber: number,
): O.Option<string> => pipe(
  nextCursor,
  O.map((cursor) => `${searchResultsPagePath}?query=${encodeURIComponent(query)}&cursor=${encodeURIComponent(cursor)}${includeUnevaluatedPreprints ? '&includeUnevaluatedPreprints=true' : ''}&page=${pageNumber}`),
);
