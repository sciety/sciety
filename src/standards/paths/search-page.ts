import { queryStringParameters } from '../query-string-parameters';

export const searchPagePath = '/search';

export const searchResultsPagePath = '/search';

export const constructSearchPageHref = (
  nextCursor: string,
  query: string,
  includeUnevaluatedPreprints: boolean,
  pageNumber: number,
): string => `${searchResultsPagePath}?${queryStringParameters.query}=${encodeURIComponent(query)}&${queryStringParameters.cursor}=${encodeURIComponent(nextCursor)}${includeUnevaluatedPreprints ? `&${queryStringParameters.includeUnevaluatedPreprints}=true` : ''}&${queryStringParameters.page}=${pageNumber}`;
