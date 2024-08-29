import { URL } from 'url';
import * as t from 'io-ts';

export const urlCodec = new t.Type<URL, string, string>(
  'URLFromString',
  (value): value is URL => false,
  (u) => t.success(new URL(u)),
  (value) => value.href,
);
