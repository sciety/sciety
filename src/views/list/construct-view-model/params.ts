import * as t from 'io-ts';
import { listIdCodec } from '../../../types/list-id.js';

export const paramsCodec = t.type({
  id: listIdCodec,
});

export type Params = t.TypeOf<typeof paramsCodec>;
