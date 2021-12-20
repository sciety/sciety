import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { createEventSourceFollowListRepository } from './event-sourced-follow-list-repository';
import { CommitEvents, unfollowCommand } from './unfollow-command';
import { DomainEvent } from '../domain-events';
import * as GroupId from '../types/group-id';

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: CommitEvents,
};

export const finishUnfollowCommand = (ports: Ports): Middleware => {
  const command = unfollowCommand(
    createEventSourceFollowListRepository(ports.getAllEvents),
    ports.commitEvents,
  );
  return async (context, next) => {
    if (context.session.command === 'unfollow') {
      await pipe(
        context.session.editorialCommunityId,
        GroupId.fromNullable,
        O.fold(
          () => context.throw(StatusCodes.BAD_REQUEST),
          async (groupId) => {
            const { user } = context.state;
            return command(user, groupId)();
          },
        ),
      );
    }

    await next();
  };
};
