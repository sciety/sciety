import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { StatusCodes } from 'http-status-codes';
import * as PR from 'io-ts/PathReporter';
import { Middleware, ParameterizedContext } from 'koa';
import { Ports as CheckUserOwnsListPorts } from './check-user-owns-list';
import { Logger } from '../../shared-ports';
import { UserDetails } from '../../types/user-details';
import { promoteListCommandCodec } from '../../write-side/commands';
import { Ports as GetLoggedInScietyUserPorts, getLoggedInScietyUser } from '../authentication-and-logging-in-of-sciety-users';
import { sendDefaultErrorHtmlResponse } from '../send-default-error-html-response';

type Dependencies = CheckUserOwnsListPorts & GetLoggedInScietyUserPorts & {
  logger: Logger,
};

const decodeCommandAndHandleFailures = (
  dependencies: Dependencies,
  context: ParameterizedContext,
  loggedInUser: O.Some<UserDetails>,
) => {
  const command = promoteListCommandCodec.decode(context.request.body);
  if (E.isLeft(command)) {
    dependencies.logger(
      'error',
      'Failed to decode a command via a form',
      {
        codec: promoteListCommandCodec.name,
        codecDecodingError: PR.failure(command.left),
        requestBody: context.request.body,
        loggedInUserId: loggedInUser.value.id,
      },
    );
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.BAD_REQUEST, 'Cannot understand the command.');
  }
  return command;
};

export const addAFeaturedListHandler = (dependencies: Dependencies): Middleware => async (context) => {
  const loggedInUser = getLoggedInScietyUser(dependencies, context);
  if (O.isNone(loggedInUser)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.FORBIDDEN, 'You must be logged in to feature a list.');
    return;
  }

  if (E.isLeft(decodeCommandAndHandleFailures(dependencies, context, loggedInUser))) {
    return;
  }

  context.redirect('/groups/prereview');
};
