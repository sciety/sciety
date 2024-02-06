import { arbitraryArticleId } from './article-id.helper';
import * as EDOI from '../../src/types/expression-doi';

export const arbitraryExpressionDoi = (): EDOI.ExpressionDoi => EDOI.fromValidatedString(arbitraryArticleId().value);
