import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { Group } from './group';
import { GroupViewModel } from './render-followed-group';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

export type Follows = (u: UserId, g: GroupId) => T.Task<boolean>;

type IsFollowedBy = (follows: Follows)
=> (userId: O.Option<UserId>)
=> (group: Group)
=> T.Task<GroupViewModel>;

export const isFollowedBy: IsFollowedBy = (follows) => (userId) => (group) => pipe(
  userId,
  O.fold(
    () => T.of(false),
    (u: UserId) => follows(u, group.id),
  ),
  T.map((b) => ({
    ...group,
    isFollowedBy: b,
  })),
);
