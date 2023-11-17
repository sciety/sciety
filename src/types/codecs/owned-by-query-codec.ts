import * as t from 'io-ts';
import { listCodec } from '../list';

export const ownedByQueryCodec = t.type({
  items: t.readonlyArray(listCodec),
});
