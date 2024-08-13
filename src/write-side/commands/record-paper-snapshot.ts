import * as t from 'io-ts';
import { expressionDoiCodec } from '../../types/expression-doi';

const recordPaperSnapshotCommandCodec = t.strict({
  expressionDois: t.readonlyArray(expressionDoiCodec),
});

export type RecordPaperSnapshotCommand = t.TypeOf<typeof recordPaperSnapshotCommandCodec>;
