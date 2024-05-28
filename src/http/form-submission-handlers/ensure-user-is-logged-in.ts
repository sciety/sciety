import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { ParameterizedContext } from 'koa';
import { Queries } from '../../read-models';
import { Logger } from '../../shared-ports';
import { UserDetails } from '../../types/user-details';
import { getAuthenticatedUserIdFromContext } from '../authentication-and-logging-in-of-sciety-users';
import { sendDefaultErrorHtmlResponse, Dependencies as SendDefaultErrorHtmlResponseDependencies } from '../send-default-error-html-response';

export type Dependencies = Queries
& SendDefaultErrorHtmlResponseDependencies
& { logger: Logger };

export const ensureUserIsLoggedIn = (
  dependencies: Dependencies,
  context: ParameterizedContext,
  errorMessage: string,
): O.Option<UserDetails> => {
  const loggedInUser = pipe(
    context,
    getAuthenticatedUserIdFromContext,
    O.chain((id) => dependencies.lookupUser(id)),
  );
  if (O.isNone(loggedInUser)) {
    dependencies.logger('warn', 'Form submission attempted while not logged in', { requestPath: context.request.path });
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.FORBIDDEN, errorMessage);
  }
  return loggedInUser;
};
