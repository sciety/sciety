import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { sequenceS } from 'fp-ts/Apply';
import { formatValidationErrors } from 'io-ts-reporters';
import { StatusCodes } from 'http-status-codes';
import {
  Ports as GetLoggedInScietyUserPorts, getAuthenticatedUserIdFromContext, getLoggedInScietyUser,
} from '../../authentication-and-logging-in-of-sciety-users';
import { createUserAccountFormPageLayout, renderFormPage } from '../../../html-pages/create-user-account-form-page';
import { constructHtmlResponse } from '../../../html-pages/construct-html-response';
import { createUserAccountFormCodec, unvalidatedFormDetailsCodec } from './codecs';
import { redirectToAuthenticationDestination } from '../../authentication-destination';
import { sendHtmlResponse } from '../../send-html-response';
import { detectClientClassification } from '../../detect-client-classification';
import { SanitisedUserInput } from '../../../types/sanitised-user-input';
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

  if (O.isNone(authenticatedUserId)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.UNAUTHORIZED, 'This step requires you do be logged in. Please try logging in again.');
    return;
  }

  if (E.isLeft(formFields)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.BAD_REQUEST, 'Something went wrong when you submitted the form. Please try again.');
    return;
  }

  await pipe(
    {
      formUserDetails: pipe(
        context.request.body,
        createUserAccountFormCodec.decode,
        E.mapLeft((errors) => {
          dependencies.logger('error', 'createUserAccountFormCodec failed', { error: formatValidationErrors(errors) });
          return 'validation-error';
        }),
      ),
      authenticatedUserId: pipe(
        context,
        getAuthenticatedUserIdFromContext,
        E.fromOption(() => 'no-authenticated-user-id'),
      ),
    },
    sequenceS(E.Apply),
    E.map(({ formUserDetails }) => ({
      ...formUserDetails,
      displayName: formUserDetails.fullName,
      userId: authenticatedUserId.value,
      avatarUrl: defaultSignUpAvatarUrl,
    })),
    T.of,
    TE.chainW((command) => pipe(
      command,
      createUserAccountCommandHandler(dependencies),
      TE.mapLeft((error) => {
        dependencies.logger('error', 'createUserAccountCommandHandler failed', { error, command });
        return 'command-failed';
      }),
    )),
    TE.mapLeft(() => pipe(
      context.request.body,
      unvalidatedFormDetailsCodec.decode,
      E.getOrElse(() => ({
        fullName: '' as SanitisedUserInput,
        handle: '' as SanitisedUserInput,
      })),
    )),
    TE.bimap(
      (formDetails) => {
        const htmlResponse = pipe(
          {
            errorSummary: O.some(''),
          },
          renderFormPage(rawUserInput(formDetails.fullName), rawUserInput(formDetails.handle)),
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
