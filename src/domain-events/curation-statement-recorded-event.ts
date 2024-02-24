import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { articleIdCodec } from '../types/article-id.js';
import { EventIdFromString } from '../types/codecs/EventIdFromString.js';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString.js';
import { evaluationLocatorCodec } from '../types/evaluation-locator.js';

export const curationStatementRecordedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('CurationStatementRecorded'),
  date: tt.DateFromISOString,
  groupId: GroupIdFromString,
  evaluationLocator: evaluationLocatorCodec,
  articleId: articleIdCodec,
});
