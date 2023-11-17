import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CreateUserAccountCommand } from '../commands/create-user-account.js';
import { CommandHandler } from '../../types/command-handler.js';
import { create } from '../resources/user/index.js';
import { DependenciesForCommands } from '../dependencies-for-commands.js';

export const createUserAccountCommandHandler = (
  dependencies: DependenciesForCommands,
): CommandHandler<CreateUserAccountCommand> => (command) => pipe(
  dependencies.getAllEvents,
  T.map(create(command)),
  TE.chainW(dependencies.commitEvents),
);
