import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DoiFromString } from '../types/article-id';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString';
import { evaluationLocatorCodec } from '../types/evaluation-locator';

export const curationStatementRecordedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('CurationStatementRecorded'),
  date: tt.DateFromISOString,
  groupId: GroupIdFromString,
  evaluationLocator: evaluationLocatorCodec,
  articleId: DoiFromString,
});
