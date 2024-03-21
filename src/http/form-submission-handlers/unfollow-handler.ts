import { Middleware } from '@koa/router';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as t from 'io-ts';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../authentication-and-logging-in-of-sciety-users';
import { unfollowCommandHandler } from '../../write-side/command-handlers';
import { Logger } from '../../infrastructure-contract';
import { GroupIdFromString } from '../../types/codecs/GroupIdFromString';
import { DependenciesForCommands } from '../../write-side/dependencies-for-commands';

type Ports = GetLoggedInScietyUserPorts & DependenciesForCommands & {
  logger: Logger,
};

const requestCodec = t.type({
  body: t.type({
    editorialcommunityid: GroupIdFromString,
  }),
});

export const unfollowHandler = (dependencies: Ports): Middleware => async (context, next) => {
  await pipe(
    context.request,
    requestCodec.decode,
    O.fromEither,
    O.map((req) => req.body.editorialcommunityid),
    O.fold(
      () => context.throw(StatusCodes.BAD_REQUEST),
      async (groupId) => pipe(
        getLoggedInScietyUser(dependencies, context),
        O.match(
          () => {
            dependencies.logger('error', 'Logged in user not found', { context });
            context.response.status = StatusCodes.INTERNAL_SERVER_ERROR;
          },
          async (userDetails) => {
            context.redirect('back');
            await pipe(
              {
                userId: userDetails.id,
                groupId,
              },
              unfollowCommandHandler(dependencies),
            )();
          },
        ),
      ),
    ),
  );

  await next();
};
