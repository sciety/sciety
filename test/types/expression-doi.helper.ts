import { arbitraryArticleId } from './article-id.helper';
import * as EDOI from '../../src/types/expression-doi';
import { arbitraryNumber } from '../helpers';

export const arbitraryExpressionDoi = (): EDOI.ExpressionDoi => EDOI.fromValidatedString(arbitraryArticleId().value);

export const arbitraryNonColdSpringHarborExpressionDoi = (): EDOI.ExpressionDoi => EDOI.fromValidatedString(`${arbitraryArticleId().value}v${arbitraryNumber(1, 9)}`);
