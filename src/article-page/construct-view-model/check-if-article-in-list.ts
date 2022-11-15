import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
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
): TE.TaskEither<never, O.Option<UserId>> => pipe(
  user,
  O.chain((u) => pipe(
    doi,
    ports.isArticleOnTheListOwnedBy(u.id),
    O.guard,
    O.map(() => u.id),
  )),
  TE.right,
);
