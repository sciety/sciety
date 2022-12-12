import * as E from 'fp-ts/Either';
import * as B from 'fp-ts/boolean';
import { identity, pipe } from 'fp-ts/function';
import * as t from 'io-ts';

const regex = /^[^<>]+$/;

export const userGeneratedInputCodec = (maxLength: number) => new t.Type(
  'userGeneratedInputCodec',
  (u): u is string => typeof u === 'string',
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain((inputString) => pipe(
      !!regex.exec(inputString) && inputString.length <= maxLength,
      B.fold(
        () => t.failure(u, c),
        () => t.success(inputString),
      ),
    )),
  ),
  identity,
);
