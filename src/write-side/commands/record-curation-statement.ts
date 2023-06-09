import * as t from 'io-ts';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { GroupIdFromString } from '../../types/codecs/GroupIdFromString';
import { evaluationLocatorCodec } from '../../types/evaluation-locator';

export const recordCurationStatementCommandCodec = t.type({
  groupId: GroupIdFromString,
  evaluationLocator: evaluationLocatorCodec,
  articleId: DoiFromString,
});

export type RecordCurationStatementCommand = t.TypeOf<typeof recordCurationStatementCommandCodec>;
