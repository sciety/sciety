import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { sequenceS } from 'fp-ts/Apply';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../http/authentication-and-logging-in-of-sciety-users';
import { htmlFragmentCodec } from '../types/html-fragment';
import { DoiFromString } from '../types/codecs/DoiFromString';
import * as LID from '../types/list-id';
import { Queries } from '../read-models';
import { UserId } from '../types/user-id';
import { GroupId } from '../types/group-id';
import { handleCreateAnnotationCommand, Dependencies as HandleCreateAnnotationCommandDependencies } from './handle-create-annotation-command';

const bodyCodec = t.type({
  annotationContent: htmlFragmentCodec,
  articleId: DoiFromString,
  listId: LID.listIdCodec,
});

type Dependencies = Queries & GetLoggedInScietyUserPorts & HandleCreateAnnotationCommandDependencies;

const scietyAdminUserId = 'auth0|650d543de75a96413ce859b1' as UserId;

const isUserAllowedToCreateAnnotation = (
  userId: UserId,
  listOwnerId: UserId | GroupId,
) => userId === listOwnerId || userId === scietyAdminUserId;

type CreateAnnotationHandler = (adapters: Dependencies) => Middleware;

export const createAnnotationHandler: CreateAnnotationHandler = (adapters) => async (context, next) => {
  const loggedInUser = getLoggedInScietyUser(adapters, context);
  if (O.isNone(loggedInUser)) {
    context.response.status = StatusCodes.FORBIDDEN;
    context.response.body = 'You must be logged in to annotate a list.';
    return;
  }

  await pipe(
    {
      loggedInUser,
      listOwnerId: pipe(
        context.request.body,
        bodyCodec.decode,
        O.fromEither,
        O.map((body) => body.listId),
        O.map(LID.fromValidatedString),
        O.chain(adapters.lookupList),
        O.chainNullableK((list) => list.ownerId.value),
      ),
    },
    sequenceS(O.Apply),
    O.filter((stuff) => isUserAllowedToCreateAnnotation(stuff.loggedInUser.id, stuff.listOwnerId)),
    O.match(
      async () => {
        context.response.status = StatusCodes.FORBIDDEN;
        context.response.body = 'Only the list owner is allowed to annotate their list.';
      },
      async () => {
        await handleCreateAnnotationCommand(adapters)(context.request.body)();
        pipe(
          context.request.body,
          bodyCodec.decode,
          E.map((params) => context.redirect(`/lists/${params.listId}`)),
        );
        await next();
      },
    ),
  );
};
