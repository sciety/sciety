import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import * as listResource from '../resources/list';
import { CommandHandler } from './command-handler';
import { CreateListCommand } from '../commands';
import { DependenciesForCommands } from '../dependencies-for-commands';

type CreateListCommandHandler = (
  dependencies: DependenciesForCommands
) => CommandHandler<CreateListCommand>;

export const createListCommandHandler: CreateListCommandHandler = (
  dependencies,
) => (
  command,
) => pipe(
  dependencies.getAllEvents,
  T.map(listResource.create(command)),
  TE.chainW(dependencies.commitEvents),
);
