import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { StatusCodes } from 'http-status-codes';
import {
  Ports as GetLoggedInScietyUserPorts, getAuthenticatedUserIdFromContext, getLoggedInScietyUser,
} from '../../authentication-and-logging-in-of-sciety-users';
import { createUserAccountFormPageLayout, renderFormPage } from '../../../html-pages/create-user-account-form-page';
import { constructHtmlResponse } from '../../../html-pages/construct-html-response';
import { createUserAccountFormCodec } from './codecs';
import { redirectToAuthenticationDestination } from '../../authentication-destination';
import { sendHtmlResponse } from '../../send-html-response';
import { detectClientClassification } from '../../detect-client-classification';
import { createUserAccountCommandHandler } from '../../../write-side/command-handlers';
import { Logger } from '../../../shared-ports';
import { DependenciesForCommands } from '../../../write-side/dependencies-for-commands';
import { sendDefaultErrorHtmlResponse } from '../../send-default-error-html-response';
import { toFieldsCodec } from '../to-fields-codec';
import { decodeAndLogFailures } from '../../../third-parties/decode-and-log-failures';
import { rawUserInput } from '../../../read-side';

const defaultSignUpAvatarUrl = '/static/images/profile-dark.svg';

type Dependencies = GetLoggedInScietyUserPorts & DependenciesForCommands & {
  logger: Logger,
};

export const createUserAccount = (dependencies: Dependencies): Middleware => async (context, next) => {
  const authenticatedUserId = getAuthenticatedUserIdFromContext(context);
  const formFields = pipe(
    context.request.body,
    decodeAndLogFailures(dependencies.logger, toFieldsCodec(createUserAccountFormCodec.props, 'createUserAccountFormFieldsCodec')),
  );
  const validatedFormFields = pipe(
    context.request.body,
    decodeAndLogFailures(dependencies.logger, createUserAccountFormCodec),
  );

  if (O.isNone(authenticatedUserId)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.UNAUTHORIZED, 'This step requires you do be logged in. Please try logging in again.');
    return;
  }

  if (E.isLeft(formFields)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.BAD_REQUEST, 'Something went wrong when you submitted the form. Please try again.');
    return;
  }

  if (E.isLeft(validatedFormFields)) {
    const htmlResponse = pipe(
      {
        errorSummary: O.some(''),
      },
      renderFormPage(rawUserInput(formFields.right.fullName), rawUserInput(formFields.right.handle)),
      E.right,
      constructHtmlResponse(
        getLoggedInScietyUser(dependencies, context),
        createUserAccountFormPageLayout,
        detectClientClassification(context),
      ),
    );
    sendHtmlResponse(context)(htmlResponse);
    return;
  }

  await pipe(
    {
      handle: validatedFormFields.right.handle,
      displayName: validatedFormFields.right.fullName,
      userId: authenticatedUserId.value,
      avatarUrl: defaultSignUpAvatarUrl,
    },
    TE.right,
    TE.chainW((command) => pipe(
      command,
      createUserAccountCommandHandler(dependencies),
      TE.mapLeft((error) => {
        dependencies.logger('error', 'createUserAccountCommandHandler failed', { error, command });
        return 'command-failed';
      }),
    )),
    TE.bimap(
      () => {
        const htmlResponse = pipe(
          {
            errorSummary: O.some(''),
          },
          renderFormPage(rawUserInput(formFields.right.fullName), rawUserInput(formFields.right.handle)),
          E.right,
          constructHtmlResponse(
            getLoggedInScietyUser(dependencies, context),
            createUserAccountFormPageLayout,
            detectClientClassification(context),
          ),
        );
        sendHtmlResponse(context)(htmlResponse);
      },
      () => redirectToAuthenticationDestination(context),
    ),
  )();
  await next();
};
