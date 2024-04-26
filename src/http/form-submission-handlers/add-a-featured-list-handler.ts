import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { decodeCommandAndHandleFailures, Dependencies as DecodeCommandAndHandleFailuresDependencies } from './decode-command-and-handle-failures';
import { promoteListCommandCodec } from '../../write-side/commands';
import { Ports as GetLoggedInScietyUserDependencies, getLoggedInScietyUser } from '../authentication-and-logging-in-of-sciety-users';
import { sendDefaultErrorHtmlResponse, Dependencies as SendDefaultErrorHtmlResponseDependencies } from '../send-default-error-html-response';

type Dependencies = GetLoggedInScietyUserDependencies
& SendDefaultErrorHtmlResponseDependencies
& DecodeCommandAndHandleFailuresDependencies;

export const addAFeaturedListHandler = (dependencies: Dependencies): Middleware => async (context) => {
  const loggedInUser = getLoggedInScietyUser(dependencies, context);
  if (O.isNone(loggedInUser)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.FORBIDDEN, 'You must be logged in to feature a list.');
    return;
  }

  if (E.isLeft(decodeCommandAndHandleFailures(dependencies, context, promoteListCommandCodec, loggedInUser.value.id))) {
    return;
  }

  context.redirect('/groups/prereview');
};
