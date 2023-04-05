import { Dispatcher, dispatcher } from '../../src/infrastructure/dispatcher';
import { createGroup } from '../../src/write-side/add-group';
import { GetAllEvents } from '../../src/shared-ports';
import { createUserAccountCommandHandler } from '../../src/write-side/create-user-account';
import { followCommandHandler } from '../../src/write-side/follow/follow-command-handler';
import { createListCommandHandler } from '../../src/write-side/create-list';
import { addArticleToListCommandHandler } from '../../src/write-side/add-article-to-list';
import { removeArticleFromListCommandHandler } from '../../src/write-side/remove-article-from-list';
import { recordEvaluationCommandHandler } from '../../src/write-side/record-evaluation';
import { createEventStore } from './create-event-store';

type CommandHandlers = {
  addArticleToList: ReturnType<typeof addArticleToListCommandHandler>,
  createGroup: ReturnType<typeof createGroup>,
  createList: ReturnType<typeof createListCommandHandler>,
  createUserAccount: ReturnType<typeof createUserAccountCommandHandler>,
  followGroup: ReturnType<typeof followCommandHandler>,
  recordEvaluation: ReturnType<typeof recordEvaluationCommandHandler>,
  removeArticleFromList: ReturnType<typeof removeArticleFromListCommandHandler>,
};

export type ReadAndWriteSides = {
  commandHandlers: CommandHandlers,
  getAllEvents: GetAllEvents,
  queries: Dispatcher['queries'],
};

export const createReadAndWriteSides = (): ReadAndWriteSides => {
  const { dispatchToAllReadModels, queries } = dispatcher();
  const eventStore = createEventStore(dispatchToAllReadModels);
  const commandHandlers = {
    addArticleToList: addArticleToListCommandHandler(eventStore),
    createGroup: createGroup(eventStore),
    createList: createListCommandHandler(eventStore),
    createUserAccount: createUserAccountCommandHandler(eventStore),
    followGroup: followCommandHandler(eventStore),
    recordEvaluation: recordEvaluationCommandHandler({ ...eventStore, ...queries }),
    removeArticleFromList: removeArticleFromListCommandHandler(eventStore),
  };
  return {
    commandHandlers,
    getAllEvents: eventStore.getAllEvents,
    queries,
  };
};
