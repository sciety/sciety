import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';

export const NumberFromString = new t.Type(
  'NumberFromString',
  (u): u is number => typeof u === 'number',
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain((s) => {
      const n = Number.parseInt(s, 10);
      return Number.isNaN(n) ? t.failure(u, c) : t.success(n);
    }),
  ),
  (a) => a.toString(),
);
