import * as tt from 'io-ts-types';
import { articleIdCodec } from '../types/article-id';

export const queryStringParameters = {
  articleId: 'articleId' as const,
  articleIdCodec,
  page: 'page' as const,
  pageCodec: tt.withFallback(tt.NumberFromString, 1),
  categoryName: 'categoryName' as const,
  categoryNameCodec: tt.NonEmptyString,
};
