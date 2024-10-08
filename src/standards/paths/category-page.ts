import { URLSearchParams } from 'url';
import { queryStringParameters } from '..';

export const categoryPagePathSpecification = '/category';

export const constructCategoryPageHref = (categoryName: string, pageNumber?: number): string => {
  const queryString = new URLSearchParams({
    [queryStringParameters.categoryName]: categoryName,
  });
  if (pageNumber !== undefined) {
    queryString.append(queryStringParameters.page, pageNumber.toString());
  }
  return `${categoryPagePathSpecification}?${queryString.toString()}`;
};
