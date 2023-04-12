import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import * as RA from 'fp-ts/ReadonlyArray';
import { Dispatcher, dispatcher } from '../../src/infrastructure/dispatcher';
import { createGroup } from '../../src/write-side/add-group';
import { DomainEvent } from '../../src/domain-events';
import { GetAllEvents, CommitEvents } from '../../src/shared-ports';
import { CommandResult } from '../../src/types/command-result';
import { createUserAccountCommandHandler } from '../../src/write-side/create-user-account';
import { followCommandHandler } from '../../src/write-side/follow/follow-command-handler';
import { createListCommandHandler } from '../../src/write-side/create-list';
import { addArticleToListCommandHandler } from '../../src/write-side/add-article-to-list';
import { removeArticleFromListCommandHandler } from '../../src/write-side/remove-article-from-list';
import { recordEvaluationCommandHandler } from '../../src/write-side/record-evaluation';
import { updateUserDetailsCommandHandler } from '../../src/write-side/command-handlers/update-user-details-command-handler';

const commitEvents = (
  inMemoryEvents: Array<DomainEvent>,
  dispatchToAllReadModels: (events: ReadonlyArray<DomainEvent>) => void,
): CommitEvents => (events) => pipe(
  events,
  RA.match(
    () => ('no-events-created' as CommandResult),
    (es) => {
      pipe(
        es,
        RA.map((event) => { inMemoryEvents.push(event); return event; }),
      );
      dispatchToAllReadModels(es);
      return 'events-created' as CommandResult;
    },
  ),
  T.of,
);

type CommandHandlers = {
  addArticleToList: ReturnType<typeof addArticleToListCommandHandler>,
  createGroup: ReturnType<typeof createGroup>,
  createList: ReturnType<typeof createListCommandHandler>,
  createUserAccount: ReturnType<typeof createUserAccountCommandHandler>,
  followGroup: ReturnType<typeof followCommandHandler>,
  recordEvaluation: ReturnType<typeof recordEvaluationCommandHandler>,
  removeArticleFromList: ReturnType<typeof removeArticleFromListCommandHandler>,
  updateUserDetails: ReturnType<typeof updateUserDetailsCommandHandler>,
};

export type ReadAndWriteSides = {
  commandHandlers: CommandHandlers,
  getAllEvents: GetAllEvents,
  queries: Dispatcher['queries'],
};

export const createReadAndWriteSides = (): ReadAndWriteSides => {
  const allEvents: Array<DomainEvent> = [];
  const { dispatchToAllReadModels, queries } = dispatcher();
  const eventStore = {
    getAllEvents: T.of(allEvents),
    commitEvents: commitEvents(allEvents, dispatchToAllReadModels),
  };
  const commandHandlers = {
    addArticleToList: addArticleToListCommandHandler(eventStore),
    createGroup: createGroup(eventStore),
    createList: createListCommandHandler(eventStore),
    createUserAccount: createUserAccountCommandHandler(eventStore),
    followGroup: followCommandHandler(eventStore),
    recordEvaluation: recordEvaluationCommandHandler({ ...eventStore, ...queries }),
    removeArticleFromList: removeArticleFromListCommandHandler(eventStore),
    updateUserDetails: updateUserDetailsCommandHandler(eventStore),
  };
  return {
    commandHandlers,
    getAllEvents: eventStore.getAllEvents,
    queries,
  };
};
