import * as t from 'io-ts';
import { rawUserInputCodec } from '../../../read-side/raw-user-input';

export const formBodyCodec = t.strict({
  fullName: rawUserInputCodec,
  handle: rawUserInputCodec,
});

export type FormBody = t.TypeOf<typeof formBodyCodec>;
