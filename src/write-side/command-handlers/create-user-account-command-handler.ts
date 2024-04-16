import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CommandHandler } from '../../types/command-handler';
import { CreateUserAccountCommand } from '../commands/create-user-account';
import { DependenciesForCommands } from '../dependencies-for-commands';
import { create } from '../resources/user';

export const createUserAccountCommandHandler = (
  dependencies: DependenciesForCommands,
): CommandHandler<CreateUserAccountCommand> => (command) => pipe(
  dependencies.getAllEvents,
  T.map(create(command)),
  TE.chainW(dependencies.commitEvents),
);
