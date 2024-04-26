import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { decodeFormSubmissionAndHandleFailures, Dependencies as DecodeFormSubmissionAndHandleFailuresDependencies } from './decode-form-submission-and-handle-failures';
import { promoteListCommandCodec } from '../../write-side/commands';
import { Ports as GetLoggedInScietyUserDependencies, getLoggedInScietyUser } from '../authentication-and-logging-in-of-sciety-users';
import { sendDefaultErrorHtmlResponse, Dependencies as SendDefaultErrorHtmlResponseDependencies } from '../send-default-error-html-response';

type Dependencies = GetLoggedInScietyUserDependencies
& SendDefaultErrorHtmlResponseDependencies
& DecodeFormSubmissionAndHandleFailuresDependencies;

export const addAFeaturedListHandler = (dependencies: Dependencies): Middleware => async (context) => {
  const loggedInUser = getLoggedInScietyUser(dependencies, context);
  if (O.isNone(loggedInUser)) {
    dependencies.logger('warn', 'Form submission attempted while not logged in', { requestPath: context.request.path });
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.FORBIDDEN, 'You must be logged in to feature a list.');
    return;
  }

  if (E.isLeft(decodeFormSubmissionAndHandleFailures(
    dependencies,
    context,
    promoteListCommandCodec,
    loggedInUser.value.id,
  ))) {
    return;
  }

  context.redirect('/groups/prereview');
};
