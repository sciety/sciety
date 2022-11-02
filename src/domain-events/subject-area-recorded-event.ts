import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { Doi } from '../types/doi';
import { generate } from '../types/event-id';

export const subjectAreaRecordedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('SubjectAreaRecorded'),
  date: tt.DateFromISOString,
  articleId: DoiFromString,
  category: t.string,
});

export type SubjectAreaRecordedEvent = t.TypeOf<typeof subjectAreaRecordedEventCodec>;

export const isSubjectAreaRecordedEvent = (event: { type: string }):
  event is SubjectAreaRecordedEvent => event.type === 'SubjectAreaRecorded';

export const subjectAreaRecorded = (
  articleId: Doi,
  category: string,
  date = new Date(),
): SubjectAreaRecordedEvent => ({
  id: generate(),
  type: 'SubjectAreaRecorded',
  date,
  articleId,
  category,
});
