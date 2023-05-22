import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { articleServerCodec } from '../types/article-server';

export const articleDetailsRecordedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('ArticleDetailsRecorded'),
  date: tt.DateFromISOString,
  authors: t.array(t.string),
  abstract: t.string,
  doi: DoiFromString,
  title: t.string,
  server: articleServerCodec,
});
