import { flow, pipe } from 'fp-ts/function';
import { ParameterizedContext } from 'koa';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { sequenceS } from 'fp-ts/Apply';
import { formatValidationErrors } from 'io-ts-reporters';
import { createUserAccountCommandHandler } from '../../command-handlers/create-user-account-command-handler';
import { getAuthenticatedUserIdFromContext } from '../../../http/authentication-and-logging-in-of-sciety-users';
import { CommandResult } from '../../../types/command-result';
import { Logger } from '../../../shared-ports';
import { DependenciesForCommands } from '../../dependencies-for-commands';
import { createUserAccountFormCodec, formFieldsCodec } from './validation';

const defaultSignUpAvatarUrl = '/static/images/profile-dark.svg';

export type Dependencies = DependenciesForCommands & {
  logger: Logger,
};

type ValidateAndExecuteCommand = (context: ParameterizedContext, dependencies: Dependencies)
=> TE.TaskEither<'missing-form-fields' | 'validation-error' | 'no-authenticated-user-id' | 'command-failed', CommandResult>;

export const validateAndExecuteCommand: ValidateAndExecuteCommand = (context, dependencies) => pipe(
  context.request.body,
  flow(
    formFieldsCodec.decode,
    E.mapLeft(() => 'missing-form-fields' as const),
  ),
  E.chainW((formFields) => pipe(
    {
      formUserDetails: pipe(
        formFields,
        createUserAccountFormCodec.decode,
        E.mapLeft((errors) => {
          dependencies.logger('error', 'createUserAccountFormCodec failed', { error: formatValidationErrors(errors) });
          return 'validation-error' as const;
        }),
      ),
      authenticatedUserId: pipe(
        context,
        getAuthenticatedUserIdFromContext,
        E.fromOption(() => 'no-authenticated-user-id' as const),
      ),
    },
    sequenceS(E.Apply),
  )),
  E.map(({ formUserDetails, authenticatedUserId }) => ({
    ...formUserDetails,
    displayName: formUserDetails.fullName,
    userId: authenticatedUserId,
    avatarUrl: defaultSignUpAvatarUrl,
  })),
  T.of,
  TE.chainW((command) => pipe(
    command,
    createUserAccountCommandHandler(dependencies),
    TE.mapLeft((error) => {
      dependencies.logger('error', 'createUserAccountCommandHandler failed', { error, command });
      return 'command-failed' as const;
    }),
  )),
);
