import * as tt from 'io-ts-types';

export const queryStringParameters = {
  page: 'page' as const,
  pageCodec: tt.withFallback(tt.NumberFromString, 1),
  categoryName: 'categoryName' as const,
  categoryNameCodec: tt.NonEmptyString,
};
