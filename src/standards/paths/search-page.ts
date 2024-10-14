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

  if (includeUnevaluatedPreprints) {
    queryString.append(queryStringParameters.includeUnevaluatedPreprints, 'true');
  }

  queryString.append(queryStringParameters.page, pageNumber.toString());

  return `${searchResultsPagePath}?${queryString.toString()}`;
};
