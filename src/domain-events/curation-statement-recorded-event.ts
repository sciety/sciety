import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { articleIdCodec } from '../types/article-id';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { evaluationLocatorCodec } from '../types/evaluation-locator';
import { GroupIdFromStringCodec } from '../types/group-id';

export const curationStatementRecordedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('CurationStatementRecorded'),
  date: tt.DateFromISOString,
  groupId: GroupIdFromStringCodec,
  evaluationLocator: evaluationLocatorCodec,
  articleId: articleIdCodec,
});
