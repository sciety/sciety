import * as tt from 'io-ts-types';
import { canonicalExpressionDoiCodec } from '../types/expression-doi';

export const queryStringParameters = {
  expressionDoi: 'expressionDoi' as const,
  expressionDoiCodec: canonicalExpressionDoiCodec,
  page: 'page' as const,
  pageCodec: tt.withFallback(tt.NumberFromString, 1),
  categoryName: 'categoryName' as const,
  categoryNameCodec: tt.NonEmptyString,
};
