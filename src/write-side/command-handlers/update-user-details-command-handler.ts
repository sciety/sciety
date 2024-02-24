import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { UpdateUserDetailsCommand } from '../commands';
import { CommandHandler } from './command-handler';
import * as userResource from '../resources/user';
import { DependenciesForCommands } from '../dependencies-for-commands';

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
