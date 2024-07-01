import { queryStringParameters } from '../../standards';

export const categoryPagePathSpecification = '/category';

export const constructCategoryPageHref = (title: string): string => `${categoryPagePathSpecification}?${queryStringParameters.categoryName}=${encodeURIComponent(title)}`;
