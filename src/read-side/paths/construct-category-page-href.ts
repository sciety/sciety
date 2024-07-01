import { queryStringParameters } from '../../standards';

export const constructCategoryPageHref = (title: string): string => `/category?${queryStringParameters.categoryName}=${encodeURIComponent(title)}`;
