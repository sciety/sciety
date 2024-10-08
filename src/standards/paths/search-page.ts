export const searchPagePath = '/search';

export const searchResultsPagePath = '/search';

export const constructSearchPageHref = (
  nextCursor: string,
  query: string,
  includeUnevaluatedPreprints: boolean,
  pageNumber: number,
): string => `${searchResultsPagePath}?query=${encodeURIComponent(query)}&cursor=${encodeURIComponent(nextCursor)}${includeUnevaluatedPreprints ? '&includeUnevaluatedPreprints=true' : ''}&page=${pageNumber}`;
