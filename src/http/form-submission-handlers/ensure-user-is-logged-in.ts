import * as O from 'fp-ts/Option';
import { StatusCodes } from 'http-status-codes';
import { ParameterizedContext } from 'koa';
import { Logger } from '../../shared-ports';
import { UserDetails } from '../../types/user-details';
import { getLoggedInScietyUser, Dependencies as GetLoggedInScietyUserDependencies } from '../authentication-and-logging-in-of-sciety-users';
import { sendDefaultErrorHtmlResponse, Dependencies as SendDefaultErrorHtmlResponseDependencies } from '../send-default-error-html-response';

export type Dependencies = GetLoggedInScietyUserDependencies
& SendDefaultErrorHtmlResponseDependencies
& { logger: Logger };

export const ensureUserIsLoggedIn = (
  dependencies: Dependencies,
  context: ParameterizedContext,
  errorMessage: string,
): O.Option<UserDetails> => {
  const loggedInUser = getLoggedInScietyUser(dependencies, context);
  if (O.isNone(loggedInUser)) {
    dependencies.logger('warn', 'Form submission attempted while not logged in', { requestPath: context.request.path });
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.FORBIDDEN, errorMessage);
  }
  return loggedInUser;
};
