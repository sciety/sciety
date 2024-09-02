import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { expressionDoiCodec } from '../types/expression-doi';

export const paperSnapshotRecordedEventCodec = t.strict({
  id: EventIdFromString,
  type: t.literal('PaperSnapshotRecorded'),
  date: tt.DateFromISOString,
  expressionDois: t.readonlyArray(expressionDoiCodec),
});
