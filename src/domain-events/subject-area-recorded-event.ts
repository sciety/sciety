import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { articleIdCodec } from '../types/article-id';
import { articleServerCodec } from '../types/article-server';
import { EventIdFromString } from '../types/codecs/EventIdFromString';

export const subjectAreaRecordedEventCodec = t.strict({
  id: EventIdFromString,
  type: t.literal('SubjectAreaRecorded'),
  date: tt.DateFromISOString,
  articleId: articleIdCodec,
  subjectArea: t.type({
    value: t.string,
    server: articleServerCodec,
  }),
});
