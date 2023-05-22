import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import * as RA from 'fp-ts/ReadonlyArray';
import { dispatcher } from '../../src/shared-read-models/dispatcher';
import { createGroup } from '../../src/write-side/add-group';
import { DomainEvent } from '../../src/domain-events';
import { GetAllEvents, CommitEvents } from '../../src/shared-ports';
import { CommandResult } from '../../src/types/command-result';
import { createUserAccountCommandHandler } from '../../src/write-side/create-user-account';
import { followCommandHandler } from '../../src/write-side/follow/follow-command-handler';
import { createListCommandHandler } from '../../src/write-side/create-list';
import { addArticleToListCommandHandler } from '../../src/write-side/add-article-to-list';
import { removeArticleFromListCommandHandler } from '../../src/write-side/remove-article-from-list';
import { updateUserDetailsCommandHandler, recordEvaluationCommandHandler } from '../../src/write-side/command-handlers';
import { unfollowCommandHandler } from '../../src/write-side/follow/unfollow-command-handler';
import { Queries } from '../../src/shared-read-models';

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

type EventStore = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

const instantiateCommandHandlers = (eventStore: EventStore, queries: Queries) => ({
  addArticleToList: addArticleToListCommandHandler(eventStore),
  createGroup: createGroup(eventStore),
  createList: createListCommandHandler(eventStore),
  createUserAccount: createUserAccountCommandHandler(eventStore),
  followGroup: followCommandHandler(eventStore),
  recordEvaluation: recordEvaluationCommandHandler({ ...eventStore, ...queries }),
  removeArticleFromList: removeArticleFromListCommandHandler(eventStore),
  unfollowGroup: unfollowCommandHandler(eventStore),
  updateUserDetails: updateUserDetailsCommandHandler(eventStore),
});

export type ReadAndWriteSides = {
  commandHandlers: ReturnType<typeof instantiateCommandHandlers>,
  getAllEvents: GetAllEvents,
  queries: Queries,
  eventStore: EventStore,
};

export const createReadAndWriteSides = (): ReadAndWriteSides => {
  const allEvents: Array<DomainEvent> = [];
  const { dispatchToAllReadModels, queries } = dispatcher();
  const eventStore: EventStore = {
    getAllEvents: T.of(allEvents),
    commitEvents: commitEvents(allEvents, dispatchToAllReadModels),
  };
  const commandHandlers = instantiateCommandHandlers(eventStore, queries);
  return {
    commandHandlers,
    getAllEvents: eventStore.getAllEvents,
    queries,
    eventStore,
  };
};
