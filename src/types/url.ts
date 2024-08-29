import { URL } from 'url';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';

export const urlCodec = new t.Type<URL, string, unknown>(
  'URLFromString',
  (value): value is URL => false,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain((input) => {
      try {
        const url = new URL(input);
        return t.success(url);
      } catch {
        return t.failure(u, c);
      }
    }),
  ),
  (value) => value.href,
);
