import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { UserId, userIdCodec } from '../../../types/user-id';
import { ListId, listIdCodec } from '../../../types/list-id';

// TODO: these should be ListIds
type Card = {
  userId: O.Option<UserId>,
  listId: O.Option<ListId>,
};

export const card1: Card = {
  listId: pipe(
    '454ba80f-e0bc-47ed-ba76-c8f872c303d2', // Biophysics Colab reading list
    listIdCodec.decode,
    O.fromEither,
  ),
  userId: pipe(
    '1384541806231175172',
    userIdCodec.decode,
    O.fromEither,
  ),
};

export const card2: Card = {
  listId: pipe(
    'dcc7c864-6630-40e7-8eeb-9fb6f012e92b', // @AvasthiReading's saved articles
    listIdCodec.decode,
    O.fromEither,
  ),
  userId: pipe(
    '1412019815619911685',
    userIdCodec.decode,
    O.fromEither,
  ),
};

export const card3: Card = {
  listId: pipe(
    '154c0659-5310-4dcc-9da3-1de24d99a542', // @LSE_Angela's List of Preprints to Read
    listIdCodec.decode,
    O.fromEither,
  ),
  userId: pipe(
    '991777251543793665',
    userIdCodec.decode,
    O.fromEither,
  ),
};
