import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as t from 'io-ts';
import { Middleware } from 'koa';
import { decodeFormSubmission } from './decode-form-submission';
import { Logger } from '../../logger';
import { Queries } from '../../read-models';
import { GroupIdFromStringCodec } from '../../types/group-id';
import { DependenciesForCommands } from '../../write-side';
import { follow } from '../../write-side/command-handlers/follow-command-handler';
import { FollowCommand } from '../../write-side/commands';
import { executeResourceAction } from '../../write-side/resources/execute-resource-action';
import { getAuthenticatedUserIdFromContext } from '../authentication-and-logging-in-of-sciety-users';
import { sendDefaultErrorHtmlResponse, Dependencies as SendErrorHtmlResponseDependencies } from '../send-default-error-html-response';

export const groupProperty = 'groupid';

type Dependencies = DependenciesForCommands & SendErrorHtmlResponseDependencies & {
  logger: Logger,
  getGroup: Queries['getGroup'],
};

const isValid = (dependencies: Dependencies, command: FollowCommand) => (
  O.isSome(dependencies.getGroup(command.groupId))
);

const formBodyCodec = t.type({
  [groupProperty]: GroupIdFromStringCodec,
});

export const followHandler = (dependencies: Dependencies): Middleware => async (context) => {
  const loggedInUserId = getAuthenticatedUserIdFromContext(context);
  if (O.isNone(loggedInUserId)) {
    context.redirect('/log-in');
    return;
  }
  const formBody = decodeFormSubmission(
    dependencies,
    context,
    formBodyCodec,
    loggedInUserId.value,
  );
  if (E.isLeft(formBody)) {
    return;
  }

  const command = {
    userId: loggedInUserId.value,
    groupId: formBody.right[groupProperty],
  };

  if (!isValid(dependencies, command)) {
    dependencies.logger('error', 'Problem with /follow', { error: StatusCodes.BAD_REQUEST });
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong; we\'re looking into it.');
    return;
  }

  await pipe(
    command,
    executeResourceAction(dependencies, follow),
  )();
  context.redirect('back');
};
