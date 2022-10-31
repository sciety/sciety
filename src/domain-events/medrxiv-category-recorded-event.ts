import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { Doi } from '../types/doi';
import { generate } from '../types/event-id';

export const medrxivCategoryRecordedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('MedrxivCategoryRecorded'),
  date: tt.DateFromISOString,
  articleId: DoiFromString,
  category: t.string,
});

export type MedrxivCategoryRecordedEvent = t.TypeOf<typeof medrxivCategoryRecordedEventCodec>;

export const isMedrxivCategoryRecordedEvent = (event: { type: string }):
  event is MedrxivCategoryRecordedEvent => event.type === 'MedrxivCategoryRecorded';

export const medrxivCategoryRecorded = (
  articleId: Doi,
  category: string,
  date = new Date(),
): MedrxivCategoryRecordedEvent => ({
  id: generate(),
  type: 'MedrxivCategoryRecorded',
  date,
  articleId,
  category,
});
