import { ArticleId } from '../../src/types/article-id';
import { ExpressionDoi } from '../../src/types/expression-doi';
import { arbitraryNumber } from '../helpers';
import * as EDOI from '../../src/types/expression-doi';

export const arbitraryArticleId = (prefix = '10.1101'): ArticleId => new ArticleId(`${prefix}/${arbitraryNumber(100000, 999999)}`);

export const toExpressionDoi = (articleId: ArticleId): ExpressionDoi => EDOI.fromValidatedString(articleId.value);
