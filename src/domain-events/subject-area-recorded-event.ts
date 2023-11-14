import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DoiFromString } from '../types/article-id';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { subjectAreaCodec } from '../types/subject-area';

export const subjectAreaRecordedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('SubjectAreaRecorded'),
  date: tt.DateFromISOString,
  articleId: DoiFromString,
  subjectArea: subjectAreaCodec,
});
