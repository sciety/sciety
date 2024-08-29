import { URL } from 'url';
import * as t from 'io-ts';

export const urlCodec = new t.Type(
  'URLFromString',
  (value): value is URL => false,
  (u, c) => t.failure(u, c),
  (value) => value.href,
);
