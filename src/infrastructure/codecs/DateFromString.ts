import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';

export const DateFromString = new t.Type(
  'DateFromString',
  (u): u is Date => u instanceof Date,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain((s) => {
      const d = new Date(s);
      return Number.isNaN(d.getTime()) ? t.failure(u, c) : t.success(d);
    }),
  ),
  (a) => a.toISOString(),
);
