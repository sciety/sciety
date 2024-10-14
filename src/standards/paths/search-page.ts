import { URLSearchParams } from 'url';
import { queryStringParameters } from '../query-string-parameters';

export const searchPagePath = '/search';

export const searchResultsPagePath = '/search';

export const constructSearchPageHref = (
  nextCursor: string,
  query: string,
  includeUnevaluatedPreprints: boolean,
  pageNumber: number,
): string => {
  const queryString = new URLSearchParams({
    [queryStringParameters.query]: query,
    [queryStringParameters.cursor]: nextCursor,
  });
  return `${searchResultsPagePath}?${queryString.toString()}${includeUnevaluatedPreprints ? `&${queryStringParameters.includeUnevaluatedPreprints}=true` : ''}&${queryStringParameters.page}=${pageNumber}`;
};
