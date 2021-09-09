import * as t from 'io-ts';
import * as tt from 'io-ts-types';

export const dateFromIngressLogString = new t.Type(
  'dateFromIngressLogString ',
  (u): u is Date => u instanceof Date,
  tt.DateFromISOString.decode,
  (d) => d.toString(),
);
