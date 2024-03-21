import { pipe } from 'fp-ts/function';
import * as tt from 'io-ts-types';
import { ParameterizedContext } from 'koa';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { sequenceS } from 'fp-ts/Apply';
import { formatValidationErrors } from 'io-ts-reporters';
import { createUserAccountCommandHandler } from '../../write-side/command-handlers/create-user-account-command-handler';
import { userHandleCodec } from '../../types/user-handle';
import { SanitisedUserInput, sanitisedUserInputCodec } from '../../types/sanitised-user-input';
import { getAuthenticatedUserIdFromContext } from '../authentication-and-logging-in-of-sciety-users';
import { CommandResult } from '../../types/command-result';
import { Logger } from '../../infrastructure-contract';
import { DependenciesForCommands } from '../../write-side/dependencies-for-commands';

const defaultSignUpAvatarUrl = '/static/images/profile-dark.svg';

export type Dependencies = DependenciesForCommands & {
  logger: Logger,
};

const createUserAccountFormCodec = t.type({
  fullName: sanitisedUserInputCodec({ maxInputLength: 30 }),
  handle: userHandleCodec,
});

const unvalidatedFormDetailsCodec = t.type({
  fullName: tt.withFallback(sanitisedUserInputCodec({ maxInputLength: 1000 }), '' as SanitisedUserInput),
  handle: tt.withFallback(sanitisedUserInputCodec({ maxInputLength: 1000 }), '' as SanitisedUserInput),
});

type UnvalidatedFormDetails = t.TypeOf<typeof unvalidatedFormDetailsCodec>;

type ValidateAndExecuteCommand = (context: ParameterizedContext, dependencies: Dependencies)
=> TE.TaskEither<UnvalidatedFormDetails, CommandResult>;

export const validateAndExecuteCommand: ValidateAndExecuteCommand = (context, dependencies) => pipe(
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
);
