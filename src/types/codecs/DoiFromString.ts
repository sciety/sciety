import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as AID from '../article-id';

export const DoiFromString = new t.Type(
  'DoiFromString',
  (u): u is AID.ArticleId => u instanceof AID.ArticleId,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain(flow(
      AID.fromString,
      O.fold(
        () => t.failure(u, c),
        t.success,
      ),
    )),
  ),
  (a) => AID.toString(a),
);
