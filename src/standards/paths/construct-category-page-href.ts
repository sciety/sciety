import { queryStringParameters } from '..';

export const categoryPagePathSpecification = '/category';

export const constructCategoryPageHref = (categoryName: string, pageNumber?: number): string => `${categoryPagePathSpecification}?${queryStringParameters.categoryName}=${encodeURIComponent(categoryName)}${pageNumber !== undefined ? `&${queryStringParameters.page}=${pageNumber}` : ''}`;
