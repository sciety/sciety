import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { canonicalExpressionDoiCodec } from '../types/expression-doi';

export const queryStringParameters = {
  expressionDoi: 'expressionDoi' as const,
  expressionDoiCodec: canonicalExpressionDoiCodec,
  page: 'page' as const,
  pageCodec: tt.withFallback(tt.NumberFromString, 1),
  categoryName: 'categoryName' as const,
  categoryNameCodec: tt.NonEmptyString,
  query: 'query' as const,
  queryCodec: t.string,
  cursor: 'cursor' as const,
  cursorCodec: tt.optionFromNullable(t.string),
  includeUnevaluatedPreprints: 'includeUnevaluatedPreprints' as const,
  includeUnevaluatedPreprintsCodec: tt.withFallback(tt.BooleanFromString, false),
};
