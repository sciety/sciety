import * as T from 'fp-ts/Task';
import { flow } from 'fp-ts/function';
import { Dispatcher, dispatcher } from '../../src/infrastructure/dispatcher';
import { createGroup } from '../../src/write-side/add-group';
import { GetAllEvents } from '../../src/shared-ports';
import { createUserAccountCommandHandler } from '../../src/write-side/create-user-account';
import { followCommandHandler } from '../../src/write-side/follow/follow-command-handler';
import { createListCommandHandler } from '../../src/write-side/create-list';
import { addArticleToListCommandHandler } from '../../src/write-side/add-article-to-list';
import { removeArticleFromListCommandHandler } from '../../src/write-side/remove-article-from-list';
import { createInMemoryEventstore } from '../../src/eventstore/create-in-memory-eventstore';
import { DomainEvent } from '../../src/domain-events';

type CommandHandlers = {
  addArticleToList: ReturnType<typeof addArticleToListCommandHandler>,
  createGroup: ReturnType<typeof createGroup>,
  createList: ReturnType<typeof createListCommandHandler>,
  createUserAccount: ReturnType<typeof createUserAccountCommandHandler>,
  followGroup: ReturnType<typeof followCommandHandler>,
  removeArticleFromList: ReturnType<typeof removeArticleFromListCommandHandler>,
};

export type ReadAndWriteSides = {
  commandHandlers: CommandHandlers,
  getAllEvents: GetAllEvents,
  queries: Dispatcher['queries'],
};

export const createReadAndWriteSides = (): ReadAndWriteSides => {
  const { dispatchToAllReadModels, queries } = dispatcher();
  const eventStore = createInMemoryEventstore<DomainEvent>(flow(dispatchToAllReadModels, T.of));
  const commandHandlers = {
    addArticleToList: addArticleToListCommandHandler(eventStore),
    createGroup: createGroup(eventStore),
    createList: createListCommandHandler(eventStore),
    createUserAccount: createUserAccountCommandHandler(eventStore),
    followGroup: followCommandHandler(eventStore),
    removeArticleFromList: removeArticleFromListCommandHandler(eventStore),
  };
  return {
    commandHandlers,
    getAllEvents: eventStore.getAllEvents,
    queries,
  };
};
