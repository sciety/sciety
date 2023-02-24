import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { UserId, userIdCodec } from '../../../types/user-id';

// TODO: these should be ListIds
type Card = {
  userId: O.Option<UserId>,
};

export const card1: Card = {
  userId: pipe(
    '1384541806231175172',
    userIdCodec.decode,
    O.fromEither,
  ),
};

export const card2: Card = {
  userId: pipe(
    '1412019815619911685',
    userIdCodec.decode,
    O.fromEither,
  ),
};

export const card3: Card = {
  userId: pipe(
    '991777251543793665',
    userIdCodec.decode,
    O.fromEither,
  ),
};
