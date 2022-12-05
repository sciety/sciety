import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';

const regex = /^[A-Za-z0-9 ,!:]+$/;

export const stringFromRegexCodec = new t.Type(
  'stringFromRegexCodec',
  (u): u is string => typeof u === 'string',
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain((foo) => pipe(
      foo,
      (s) => {
        if (regex.exec(s)) {
          return O.some(s);
        }
        return O.none;
      },
      O.fold(
        () => t.failure(u, c),
        t.success,
      ),
    )),
  ),
  (a) => a.toString(),
);
