import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { CommandHandler } from '../../types/command-handler';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { toErrorMessage } from '../../types/error-message';
import { UpdateGroupDetailsCommand } from '../commands';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type UpdateGroupDetailsCommandHandler = (
  adapters: Ports
) => CommandHandler<UpdateGroupDetailsCommand>;

export const updateGroupDetailsCommandHandler: UpdateGroupDetailsCommandHandler = (
  adapters,
) => (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  command,
) => pipe(
  adapters.getAllEvents,
  T.map(() => E.left(toErrorMessage('not implemented yet.'))),
  TE.chainTaskK(adapters.commitEvents),
);
