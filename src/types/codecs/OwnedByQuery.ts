import * as t from 'io-ts';
import { listCodec } from '../list';

export const OwnedByQuery = t.type({
  items: t.readonlyArray(listCodec),
});
