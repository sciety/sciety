import * as t from 'io-ts';
import { listCodec } from '../../shared-read-models/lists/list';

export const OwnedByQuery = t.type({
  items: t.readonlyArray(listCodec),
});
