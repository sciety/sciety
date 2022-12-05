import * as O from 'fp-ts/Option';
import { Lazy, pipe } from 'fp-ts/function';
import { IsArticleOnTheListOwnedBy } from '../../shared-ports';
import { Doi } from '../../types/doi';
import { ListId } from '../../types/list-id';
import { User } from '../../types/user';

export type Ports = {
  isArticleOnTheListOwnedBy: IsArticleOnTheListOwnedBy,
};

type CheckIfArticleInList = Lazy<O.Option<ListId>>;

export const checkIfArticleInList = (ports: Ports) => (
  doi: Doi,
  user: O.Option<User>,
): CheckIfArticleInList => pipe(
  user,
  O.fold(
    () => () => O.none,
    (u) => pipe(
      doi,
      ports.isArticleOnTheListOwnedBy(u.id),
    ),
  ),
);
