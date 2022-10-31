import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { Doi } from '../types/doi';
import { generate } from '../types/event-id';

export const biorxivCategoryRecordedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('BiorxivCategoryRecorded'),
  date: tt.DateFromISOString,
  articleId: DoiFromString,
  category: t.string,
});

export type BiorxivCategoryRecordedEvent = t.TypeOf<typeof biorxivCategoryRecordedEventCodec>;

export const isBiorxivCategoryRecordedEvent = (event: { type: string }):
  event is BiorxivCategoryRecordedEvent => event.type === 'BiorxivCategoryRecorded';

export const biorxivCategoryRecorded = (
  articleId: Doi,
  category: string,
  date = new Date(),
): BiorxivCategoryRecordedEvent => ({
  id: generate(),
  type: 'BiorxivCategoryRecorded',
  date,
  articleId,
  category,
});
