import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { Ports as UnfollowCommandPorts, unfollowCommand } from './unfollow-command';
import * as GroupId from '../../types/group-id';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../../http/authentication-and-logging-in-of-sciety-users';
import { Logger } from '../../shared-ports';

type Ports = GetLoggedInScietyUserPorts & UnfollowCommandPorts & {
  logger: Logger,
};

export const finishUnfollowCommand = (ports: Ports): Middleware => async (context, next) => {
  if (context.session.command === 'unfollow') {
    await pipe(
      context.session.editorialCommunityId,
      GroupId.fromNullable,
      O.fold(
        () => context.throw(StatusCodes.BAD_REQUEST),
        async (groupId) => pipe(
          getLoggedInScietyUser(ports, context),
          O.match(
            () => {
              ports.logger('error', 'Logged in user not found', { context });
              context.response.status = StatusCodes.INTERNAL_SERVER_ERROR;
            },
            async (userDetails) => {
              await unfollowCommand(ports)(userDetails.id, groupId)();
            },
          ),
        ),
      ),
    );
  }

  await next();
};
