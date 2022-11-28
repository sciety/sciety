import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { IsArticleOnTheListOwnedBy } from '../../shared-ports';
import { Doi } from '../../types/doi';
import { User } from '../../types/user';
import { UserId } from '../../types/user-id';

export type Ports = {
  isArticleOnTheListOwnedBy: IsArticleOnTheListOwnedBy,
};

export const checkIfArticleInList = (ports: Ports) => (
  doi: Doi,
  user: O.Option<User>,
): O.Option<UserId> => pipe(
  user,
  O.chain((u) => pipe(
    doi,
    ports.isArticleOnTheListOwnedBy(u.id),
    O.map(() => u.id),
  )),
);
