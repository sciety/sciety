import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { Doi } from '../types/doi';
import { generate } from '../types/event-id';

export const articleVersionRecordedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('ArticleVersionRecorded'),
  date: tt.DateFromISOString,
  articleId: DoiFromString,
  version: t.number,
  publishedAt: tt.DateFromISOString,
});

export type ArticleVersionRecordedEvent = t.TypeOf<typeof articleVersionRecordedEventCodec>;

export const isArticleVersionRecordedEvent = (event: { type: string }):
  event is ArticleVersionRecordedEvent => event.type === 'ArticleVersionRecorded';

export const articleVersionRecorded = (
  articleId: Doi,
  version: number,
  publishedAt: Date,
  date = new Date(),
): ArticleVersionRecordedEvent => ({
  id: generate(),
  type: 'ArticleVersionRecorded',
  date,
  articleId,
  version,
  publishedAt,
});
