import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CommandHandler } from '../../types/command-handler';
import { EditListDetailsCommand } from '../commands';
import { DependenciesForCommands } from '../dependencies-for-commands';
import * as listResource from '../resources/list';

type EditListDetailsCommandHandler = (
  dependencies: DependenciesForCommands
) => CommandHandler<EditListDetailsCommand>;

export const editListDetailsCommandHandler: EditListDetailsCommandHandler = (
  dependencies,
) => (
  command,
) => pipe(
  dependencies.getAllEvents,
  T.map(listResource.update(command)),
  TE.chainW(dependencies.commitEvents),
);
