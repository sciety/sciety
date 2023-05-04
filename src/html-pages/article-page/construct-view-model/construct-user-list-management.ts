import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Doi } from '../../../types/doi';
import { UserId } from '../../../types/user-id';
import * as LOID from '../../../types/list-owner-id';
import { sortByDefaultListOrdering } from '../../sort-by-default-list-ordering';
import { Queries } from '../../../shared-read-models';

export type Ports = Pick<Queries, 'selectListContainingArticle' | 'selectAllListsOwnedBy'>;

export const constructUserListManagement = (user: O.Option<{ id: UserId }>, ports: Ports, articleId: Doi) => pipe(
  user,
  O.map(
    ({ id }) => pipe(
      ports.selectListContainingArticle(id)(articleId),
      O.foldW(
        () => pipe(
          id,
          LOID.fromUserId,
          ports.selectAllListsOwnedBy,
          sortByDefaultListOrdering,
          RA.map((list) => ({
            listId: list.id,
            listName: list.name,
          })),
          (lists) => E.left({ lists }),
        ),
        (list) => E.right({
          listId: list.id,
          listName: list.name,
        }),
      ),
    ),
  ),
);
