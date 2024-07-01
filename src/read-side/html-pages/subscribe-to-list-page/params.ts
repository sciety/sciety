import * as t from 'io-ts';
import { listIdCodec } from '../../../types/list-id';

export const paramsCodec = t.strict({
  listId: listIdCodec,
});

export type Params = t.TypeOf<typeof paramsCodec>;
