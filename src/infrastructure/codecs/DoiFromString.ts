import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as Doi from '../../types/doi';

export const DoiFromString = new t.Type(
  'DoiFromString',
  (u): u is Doi.Doi => u instanceof Doi.Doi,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain(flow(
      Doi.fromString,
      O.fold(
        () => t.failure(u, c),
        t.success,
      ),
    )),
  ),
  (a) => a.toString(),
);
