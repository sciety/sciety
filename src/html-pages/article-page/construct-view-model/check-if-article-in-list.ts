import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { IsArticleOnTheListOwnedBy } from '../../../shared-ports';
import { Doi } from '../../../types/doi';
import { ListId } from '../../../types/list-id';
import { User } from '../../../types/user';

export type Ports = {
  isArticleOnTheListOwnedBy: IsArticleOnTheListOwnedBy,
};

export const checkIfArticleInList = (ports: Ports) => (
  doi: Doi,
  user: O.Option<User>,
): O.Option<ListId> => pipe(
  user,
  O.chain((u) => pipe(
    doi,
    ports.isArticleOnTheListOwnedBy(u.id),
  )),
);
