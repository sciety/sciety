import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { IsArticleOnTheListOwnedBy } from '../../../shared-ports';
import { Doi } from '../../../types/doi';
import { ListId } from '../../../types/list-id';
import { UserId } from '../../../types/user-id';

export type Ports = {
  isArticleOnTheListOwnedBy: IsArticleOnTheListOwnedBy,
};

export const checkIfArticleInList = (ports: Ports) => (
  doi: Doi,
  userId: O.Option<UserId>,
): O.Option<ListId> => pipe(
  userId,
  O.chain((u) => pipe(
    doi,
    ports.isArticleOnTheListOwnedBy(u),
  )),
);
