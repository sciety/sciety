import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DoiFromString } from '../../types/codecs/DoiFromString';

export const recordArticleVersionCommandCodec = t.type({
  articleId: DoiFromString,
  version: t.number,
  publishedAt: tt.DateFromISOString,
});

export type RecordArticleVersionCommand = t.TypeOf<typeof recordArticleVersionCommandCodec>;
