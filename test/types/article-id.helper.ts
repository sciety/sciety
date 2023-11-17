import { ArticleId } from '../../src/types/article-id.js';
import { arbitraryNumber } from '../helpers.js';

export const arbitraryArticleId = (prefix = '10.1101'): ArticleId => new ArticleId(`${prefix}/${arbitraryNumber(100000, 999999)}`);
