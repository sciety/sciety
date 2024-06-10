import { arbitraryNumber } from './helpers';

export const arbitraryArticleId = (prefix = '10.1101'): string => `${prefix}/${arbitraryNumber(100000, 999999)}`;
