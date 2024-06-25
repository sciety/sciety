import * as EDOI from '../../src/types/expression-doi';
import { arbitraryNumber } from '../helpers';

export const arbitraryExpressionDoi = (): EDOI.ExpressionDoi => (
  EDOI.fromValidatedString(`10.1101/${arbitraryNumber(100000, 999999)}`)
);
