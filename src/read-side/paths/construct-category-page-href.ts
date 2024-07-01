import { queryStringParameters } from '../../standards';

export const categoryPagePathSpecification = '/category';

export const constructCategoryPageHref = (categoryName: string): string => `${categoryPagePathSpecification}?${queryStringParameters.categoryName}=${encodeURIComponent(categoryName)}`;
