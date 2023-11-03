import * as O from 'fp-ts/Option';
import * as PR from 'io-ts/PathReporter';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import * as E from 'fp-ts/Either';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../authentication-and-logging-in-of-sciety-users';
import { Queries } from '../../read-models';
import { UserId } from '../../types/user-id';
import { GroupId } from '../../types/group-id';
import { handleCreateAnnotationCommand, Dependencies as HandleCreateAnnotationCommandDependencies } from './handle-create-annotation-command';
import { annotateArticleInListCommandCodec } from '../../write-side/commands';

type Dependencies = Queries & GetLoggedInScietyUserPorts & HandleCreateAnnotationCommandDependencies;

const scietyAdminUserId = 'auth0|650d543de75a96413ce859b1' as UserId;

const isUserAllowedToCreateAnnotation = (
  userId: UserId,
  listOwnerId: UserId | GroupId,
) => userId === listOwnerId || userId === scietyAdminUserId;

type CreateAnnotationHandler = (adapters: Dependencies) => Middleware;

export const createAnnotationHandler: CreateAnnotationHandler = (adapters) => async (context) => {
  const loggedInUser = getLoggedInScietyUser(adapters, context);
  if (O.isNone(loggedInUser)) {
    context.response.status = StatusCodes.FORBIDDEN;
    context.response.body = 'You must be logged in to annotate a list.';
    return;
  }
  const command = annotateArticleInListCommandCodec.decode(context.request.body);
  if (E.isLeft(command)) {
    adapters.logger(
      'error',
      'Failed to decode the create annotation form',
      {
        codecDecodingError: PR.failure(command.left),
        requestBody: context.request.body,
        loggedInUserId: loggedInUser.value.id,
      },
    );
    context.response.status = StatusCodes.BAD_REQUEST;
    context.response.body = 'Cannot understand the command.';
    return;
  }

  await pipe(
    command.right.listId,
    adapters.lookupList,
    O.chainNullableK((list) => list.ownerId.value),
    O.filter((listOwnerId) => isUserAllowedToCreateAnnotation(loggedInUser.value.id, listOwnerId)),
    O.match(
      async () => {
        context.response.status = StatusCodes.FORBIDDEN;
        context.response.body = 'Only the list owner is allowed to annotate their list.';
      },
      async () => {
        const commandResult = await handleCreateAnnotationCommand(adapters)(context.request.body)();
        if (E.isRight(commandResult)) {
          context.redirect(`/lists/${command.right.listId}`);
          return;
        }
        context.response.status = StatusCodes.BAD_REQUEST;
        context.response.body = commandResult.left;
      },
    ),
  );
};
