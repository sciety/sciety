import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { UpdateUserDetailsCommand } from '../commands/index.js';
import { CommandHandler } from '../../types/command-handler.js';
import * as userResource from '../resources/user/index.js';
import { DependenciesForCommands } from '../dependencies-for-commands.js';

type UpdateUserDetailsCommandHandler = (
  dependencies: DependenciesForCommands
) => CommandHandler<UpdateUserDetailsCommand>;

export const updateUserDetailsCommandHandler: UpdateUserDetailsCommandHandler = (
  dependencies,
) => (command) => pipe(
  dependencies.getAllEvents,
  TE.rightTask,
  TE.chainEitherKW(userResource.update(command)),
  TE.chainW(dependencies.commitEvents),
);
