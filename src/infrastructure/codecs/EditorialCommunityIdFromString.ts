import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as EditorialCommunityId from '../../types/editorial-community-id';

export const EditorialCommunityIdFromString = new t.Type(
  'EditorialCommunityIdFromString',
  (u): u is EditorialCommunityId.EditorialCommunityId => u instanceof EditorialCommunityId.EditorialCommunityId,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain(flow(
      EditorialCommunityId.fromString,
      O.fold(
        () => t.failure(u, c),
        t.success,
      ),
    )),
  ),
  (a) => a.toString(),
);
