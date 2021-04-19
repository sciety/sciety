import * as O from 'fp-ts/Option';
import { identity, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { CommitEvents, followCommand, GetFollowList } from './follow-command';
import * as GroupId from '../types/group-id';
import { User } from '../types/user';

export const sessionGroupProperty = 'groupId';

type Ports = {
  commitEvents: CommitEvents,
  getFollowList: GetFollowList,
};

export const finishFollowCommand = (ports: Ports) => (g: string, user: User): Middleware => async (context) => {
  await pipe(
    g,
    GroupId.fromNullable,
    O.map(async (groupId) => followCommand(ports.getFollowList, ports.commitEvents)(user, groupId)()),
    O.fold(
      () => context.throw(StatusCodes.BAD_REQUEST),
      identity,
    ),
  );
};
