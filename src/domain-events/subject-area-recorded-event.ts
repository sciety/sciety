import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { articleIdCodec } from '../types/article-id.js';
import { EventIdFromString } from '../types/codecs/EventIdFromString.js';
import { subjectAreaCodec } from '../types/subject-area.js';

export const subjectAreaRecordedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('SubjectAreaRecorded'),
  date: tt.DateFromISOString,
  articleId: articleIdCodec,
  subjectArea: subjectAreaCodec,
});
