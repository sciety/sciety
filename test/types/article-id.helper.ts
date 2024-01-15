import { ArticleId } from '../../src/types/article-id';
import { arbitraryNumber } from '../helpers';

export const arbitraryArticleId = (prefix = '10.1101'): ArticleId => new ArticleId(`${prefix}/${arbitraryNumber(100000, 999999)}`);

export const toExpressionDoi = (articleId: ArticleId): ArticleId => articleId;
