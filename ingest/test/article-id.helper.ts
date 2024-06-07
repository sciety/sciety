import { arbitraryNumber } from './helpers';
import { ArticleId } from '../../src/types/article-id';

export const arbitraryArticleId = (prefix = '10.1101'): ArticleId => new ArticleId(`${prefix}/${arbitraryNumber(100000, 999999)}`);
