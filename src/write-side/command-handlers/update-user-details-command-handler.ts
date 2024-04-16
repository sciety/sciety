import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CommandHandler } from '../../types/command-handler';
import { UpdateUserDetailsCommand } from '../commands';
import { DependenciesForCommands } from '../dependencies-for-commands';
import * as userResource from '../resources/user';

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
