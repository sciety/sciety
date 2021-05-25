import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as RI from '../review-id';

export const ReviewIdFromString = new t.Type(
  'ReviewIdFromString',
  RI.isReviewId,
  (input, context) => pipe(
    t.string.validate(input, context),
    E.chain(flow(
      RI.deserialize,
      O.fold(
        () => t.failure(input, context),
        t.success,
      ),
    )),
  ),
  RI.serialize,
);
