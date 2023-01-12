import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import * as t from 'io-ts';
import { userGeneratedInputCodec } from '../../types/codecs/user-generated-input-codec';

// eslint-disable-next-line @typescript-eslint/ban-types
type Ports = {};

const createUserAccountFormCodec = t.type({
  displayName: userGeneratedInputCodec(30),
  handle: userGeneratedInputCodec(30),
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createUserAccount = (adapters: Ports): Middleware => async (context) => pipe(
  context.request.body,
  createUserAccountFormCodec.decode,
  (foo) => foo,

);
