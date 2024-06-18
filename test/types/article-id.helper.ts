import { ArticleId } from '../../src/types/article-id';
import { arbitraryNumber } from '../helpers';

/**
 * @deprecated
 * Replace with:
 * - arbitraryWord(), if the code tested does not make assumptions about the value being a DOI
 * - arbitraryExpressionDoi(), if the code uses the type ExpressionDoi
 * - Any other helper that matches the code expectations
 */
export const arbitraryArticleId = (prefix = '10.1101'): ArticleId => new ArticleId(`${prefix}/${arbitraryNumber(100000, 999999)}`);
