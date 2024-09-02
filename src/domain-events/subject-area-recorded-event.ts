import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { articleIdCodec } from '../types/article-id';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { subjectAreaCodec } from '../types/subject-area';

export const subjectAreaRecordedEventCodec = t.strict({
  id: EventIdFromString,
  type: t.literal('SubjectAreaRecorded'),
  date: tt.DateFromISOString,
  articleId: articleIdCodec,
  subjectArea: subjectAreaCodec,
});
