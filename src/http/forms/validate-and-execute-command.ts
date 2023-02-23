import { pipe } from 'fp-ts/function';
import * as tt from 'io-ts-types';
import { ParameterizedContext } from 'koa';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { sequenceS } from 'fp-ts/Apply';
import { createUserAccountCommandHandler, Ports as CreateUserAccountCommandHandlerPorts } from '../../write-side/create-user-account/create-user-account-command-handler';
import { userHandleCodec } from '../../types/user-handle';
import { UserGeneratedInput, userGeneratedInputCodec } from '../../types/user-generated-input';
import {
  getAuthenticatedUserIdFromContext, Ports as GetLoggedInScietyUserPorts,
} from '../authentication-and-logging-in-of-sciety-users';
import { CommandResult } from '../../types/command-result';

const defaultSignUpAvatarUrl = '/static/images/profile-dark.svg';

export type Ports = GetLoggedInScietyUserPorts & CreateUserAccountCommandHandlerPorts;

const createUserAccountFormCodec = t.type({
  fullName: userGeneratedInputCodec(30),
  handle: userHandleCodec,
});

const unvalidatedFormDetailsCodec = t.type({
  fullName: tt.withFallback(userGeneratedInputCodec(1000), '' as UserGeneratedInput),
  handle: tt.withFallback(userGeneratedInputCodec(1000), '' as UserGeneratedInput),
});

type UnvalidatedFormDetails = t.TypeOf<typeof unvalidatedFormDetailsCodec>;

type ValidateAndExecuteCommand = (context: ParameterizedContext, adapters: Ports)
=> TE.TaskEither<UnvalidatedFormDetails, CommandResult>;

export const validateAndExecuteCommand: ValidateAndExecuteCommand = (context, adapters) => pipe(
  {
    formUserDetails: pipe(
      context.request.body,
      createUserAccountFormCodec.decode,
      E.mapLeft(() => 'validation-error'),
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
  TE.chainW(createUserAccountCommandHandler(adapters)),
  TE.mapLeft(() => pipe(
    context.request.body,
    unvalidatedFormDetailsCodec.decode,
    E.getOrElse(() => ({
      fullName: '' as UserGeneratedInput,
      handle: '' as UserGeneratedInput,
    })),
  )),
);
