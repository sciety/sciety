import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import * as LOID from '../../../types/list-owner-id';
import { userIdCodec } from '../../../types/user-id';
import { SelectAllListsOwnedBy } from '../../../shared-ports';

export type Ports = {
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

export const constructViewModel = (ports: Ports) => pipe(
  '1295307136415735808',
  userIdCodec.decode,
  E.getOrElseW(() => { throw new Error(); }),
  LOID.fromUserId,
  ports.selectAllListsOwnedBy,
  RA.map((list) => ({
    listId: list.id,
    articleCount: list.articleIds.length,
    updatedAt: O.some(list.updatedAt),
    title: list.name,
    description: list.description,
    articleCountLabel: 'This list contains',
  })),
);
