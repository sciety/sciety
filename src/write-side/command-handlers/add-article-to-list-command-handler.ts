import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { addArticle } from '../resources/list';
import { AddArticleToListCommand } from '../commands';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { CommandHandler } from '../../types/command-handler';

export type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type AddArticleToListCommandHandler = (
  adapters: Ports
) => CommandHandler<AddArticleToListCommand>;

export const addArticleToListCommandHandler: AddArticleToListCommandHandler = (
  adapters,
) => (
  command,
) => pipe(
  adapters.getAllEvents,
  T.map(addArticle(command)),
  TE.chainTaskK(adapters.commitEvents),
);
