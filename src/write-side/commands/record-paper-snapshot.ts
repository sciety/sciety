import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { alphanumerical, expressionDoiCodec } from '../../types/expression-doi';

const recordPaperSnapshotCommandCodec = t.strict({
  expressionDois: tt.setFromArray(expressionDoiCodec, alphanumerical),
});

export type RecordPaperSnapshotCommand = t.TypeOf<typeof recordPaperSnapshotCommandCodec>;
