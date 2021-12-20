import { Middleware } from '@koa/router';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { createEventSourceFollowListRepository } from './event-sourced-follow-list-repository';
import { CommitEvents, unfollowCommand } from './unfollow-command';
import { DomainEvent } from '../domain-events';
import * as GroupId from '../types/group-id';

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: CommitEvents,
};

export const unfollowHandler = (ports: Ports): Middleware => {
  const command = unfollowCommand(
    createEventSourceFollowListRepository(ports.getAllEvents),
    ports.commitEvents,
  );
  return async (context, next) => {
    await pipe(
      context.request.body.editorialcommunityid,
      GroupId.fromNullable,
      O.fold(
        () => context.throw(StatusCodes.BAD_REQUEST),
        async (groupId) => {
          const { user } = context.state;
          context.redirect('back');
          return command(user, groupId)();
        },
      ),
    );

    await next();
  };
};
