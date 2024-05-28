import * as O from 'fp-ts/Option';
import { StatusCodes } from 'http-status-codes';
import { ParameterizedContext } from 'koa';
import { Queries } from '../../read-models';
import { Logger } from '../../shared-ports';
import { UserId } from '../../types/user-id';
import { getAuthenticatedUserIdFromContext } from '../authentication-and-logging-in-of-sciety-users';
import { sendDefaultErrorHtmlResponse, Dependencies as SendDefaultErrorHtmlResponseDependencies } from '../send-default-error-html-response';

export type Dependencies = Queries
& SendDefaultErrorHtmlResponseDependencies
& { logger: Logger };

export const ensureUserIsLoggedIn = (
  dependencies: Dependencies,
  context: ParameterizedContext,
  errorMessage: string,
): O.Option<UserId> => {
  const loggedInUserId = getAuthenticatedUserIdFromContext(context);
  if (O.isNone(loggedInUserId)) {
    dependencies.logger('warn', 'Form submission attempted while not logged in', { requestPath: context.request.path });
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.FORBIDDEN, errorMessage);
  }
  return loggedInUserId;
};
