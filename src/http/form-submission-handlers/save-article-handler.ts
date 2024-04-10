import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Middleware } from 'koa';
import { StatusCodes } from 'http-status-codes';
import { Logger } from '../../shared-ports';
import { articleIdCodec } from '../../types/article-id';
import { getAuthenticatedUserIdFromContext, Ports as GetLoggedInScietyUserPorts } from '../authentication-and-logging-in-of-sciety-users';
import { Ports as CheckUserOwnsListPorts } from './check-user-owns-list';
import { listIdCodec } from '../../types/list-id';
import { AddArticleToListCommand } from '../../write-side/commands';
import { addArticleToListCommandHandler } from '../../write-side/command-handlers';
import { DependenciesForCommands } from '../../write-side/dependencies-for-commands';
import { unsafeUserInputCodec } from '../../types/unsafe-user-input';
import { sendDefaultErrorHtmlResponse } from '../send-default-error-html-response';
import { decodeAndLogFailures } from '../../third-parties/decode-and-log-failures';
import * as LOID from '../../types/list-owner-id';
import { UserId } from '../../types/user-id';

export const articleIdFieldName = 'articleid';

type Ports = CheckUserOwnsListPorts & GetLoggedInScietyUserPorts & DependenciesForCommands & {
  logger: Logger,
};

const userInvisibleFormFieldsCodec = t.strict({
  [articleIdFieldName]: articleIdCodec,
  listId: listIdCodec,
});

const userEditableFormFieldsCodec = t.strict({
  annotation: unsafeUserInputCodec,
});

const saveArticleFormBodyCodec = t.intersection([userInvisibleFormFieldsCodec, userEditableFormFieldsCodec], 'saveArticleFormBodyCodec');

const isAuthorised = (
  listOwnerId: LOID.ListOwnerId, userId: UserId,
): boolean => LOID.eqListOwnerId.equals(listOwnerId, LOID.fromUserId(userId));

const toCommand = (form: t.TypeOf<typeof saveArticleFormBodyCodec>): AddArticleToListCommand => ({
  articleId: form[articleIdFieldName],
  listId: form.listId,
  annotation: form.annotation.length === 0 ? undefined : form.annotation,
});

export const saveArticleHandler = (dependencies: Ports): Middleware => async (context) => {
  const authenticatedUserId = getAuthenticatedUserIdFromContext(context);
  const formBody = pipe(
    context.request.body,
    decodeAndLogFailures(dependencies.logger, saveArticleFormBodyCodec),
  );

  if (O.isNone(authenticatedUserId)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.UNAUTHORIZED, 'This step requires you do be logged in. Please try logging in again.');
    return;
  }
  if (E.isLeft(formBody)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.BAD_REQUEST, 'Something went wrong when you submitted the form. Please try again.');
    return;
  }

  const listOwnerId = pipe(
    formBody.right.listId,
    dependencies.lookupList,
    O.map((list) => list.ownerId),
  );

  if (O.isNone(listOwnerId)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.BAD_REQUEST, 'The list you are trying to save to does not exist.');
    return;
  }

  if (!isAuthorised(listOwnerId.value, authenticatedUserId.value)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.UNAUTHORIZED, 'You are not the owner of the list you are trying to save to.');
    return;
  }

  const commandResult = await pipe(
    formBody.right,
    toCommand,
    addArticleToListCommandHandler(dependencies),
  )();

  if (E.isLeft(commandResult)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong on our end when we tried to save this article to your list. Please try again later.');
    return;
  }

  context.redirect(`/lists/${formBody.right.listId}`);
};
