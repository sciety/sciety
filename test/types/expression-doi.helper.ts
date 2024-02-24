import { arbitraryArticleId } from './article-id.helper.js';
import * as EDOI from '../../src/types/expression-doi.js';

export const arbitraryExpressionDoi = (): EDOI.ExpressionDoi => EDOI.fromValidatedString(arbitraryArticleId().value);
