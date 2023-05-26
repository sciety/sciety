import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { Doi } from '../types/doi';
import { generate } from '../types/event-id';
import { SubjectArea, subjectAreaCodec } from '../types/subject-area';

export const subjectAreaRecordedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('SubjectAreaRecorded'),
  date: tt.DateFromISOString,
  articleId: DoiFromString,
  subjectArea: subjectAreaCodec,
});

type SubjectAreaRecordedEvent = t.TypeOf<typeof subjectAreaRecordedEventCodec>;

export const subjectAreaRecorded = (
  articleId: Doi,
  subjectArea: SubjectArea,
  date = new Date(),
): SubjectAreaRecordedEvent => ({
  id: generate(),
  type: 'SubjectAreaRecorded',
  date,
  articleId,
  subjectArea,
});
