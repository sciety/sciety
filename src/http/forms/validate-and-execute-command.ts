import { flow, pipe } from 'fp-ts/function';
import * as tt from 'io-ts-types';
import { ParameterizedContext } from 'koa';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { sequenceS } from 'fp-ts/Apply';
import { formatValidationErrors } from 'io-ts-reporters';
import { createUserAccountCommandHandler, Ports as CreateUserAccountCommandHandlerPorts } from '../../write-side/create-user-account/create-user-account-command-handler';
import { userHandleCodec } from '../../types/user-handle';
import { UserGeneratedInput, userGeneratedInputCodec } from '../../types/user-generated-input';
import { getAuthenticatedUserIdFromContext } from '../authentication-and-logging-in-of-sciety-users';
import { CommandResult } from '../../types/command-result';
import { Logger } from '../../shared-ports';

const defaultSignUpAvatarUrl = '/static/images/profile-dark.svg';

export type Ports = CreateUserAccountCommandHandlerPorts & { logger: Logger };

const createUserAccountFormCodec = t.type({
  fullName: userGeneratedInputCodec({ maxInputLength: 30 }),
  handle: userHandleCodec,
});

const unvalidatedFormDetailsCodec = t.type({
  fullName: tt.withFallback(userGeneratedInputCodec({ maxInputLength: 1000 }), '' as UserGeneratedInput),
  handle: tt.withFallback(userGeneratedInputCodec({ maxInputLength: 1000 }), '' as UserGeneratedInput),
});

type UnvalidatedFormDetails = t.TypeOf<typeof unvalidatedFormDetailsCodec>;

type ValidateAndExecuteCommand = (context: ParameterizedContext, adapters: Ports)
=> TE.TaskEither<UnvalidatedFormDetails, CommandResult>;

export const validateAndExecuteCommand: ValidateAndExecuteCommand = (context, adapters) => pipe(
  {
    formUserDetails: pipe(
      context.request.body,
      createUserAccountFormCodec.decode,
      E.mapLeft((errors) => {
        adapters.logger('error', 'createUserAccountFormCodec failed', { error: formatValidationErrors(errors) });
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
  TE.chainW(flow(
    createUserAccountCommandHandler(adapters),
    TE.mapLeft((error) => {
      adapters.logger('error', 'createUserAccountCommandHandler failed', { error });
      return 'command-failed';
    }),
  )),
  TE.mapLeft(() => pipe(
    context.request.body,
    unvalidatedFormDetailsCodec.decode,
    E.getOrElse(() => ({
      fullName: '' as UserGeneratedInput,
      handle: '' as UserGeneratedInput,
    })),
  )),
);
