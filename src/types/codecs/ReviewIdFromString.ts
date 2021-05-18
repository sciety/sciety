import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as RI from '../review-id';

export const ReviewIdFromString = new t.Type(
  'ReviewIdFromString',
  RI.isReviewId,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain(flow(
      RI.deserialize,
      O.fold(
        () => t.failure(u, c),
        t.success,
      ),
    )),
  ),
  RI.toString,
);
