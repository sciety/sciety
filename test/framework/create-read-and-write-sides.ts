import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as listResource from '../../src/write-side/resources/list';
import { dispatcher, Queries } from '../../src/read-models';
import * as groupResource from '../../src/write-side/resources/group';
import * as evaluationResource from '../../src/write-side/resources/evaluation';
import { GetAllEvents, CommitEvents } from '../../src/shared-ports';
import { followCommandHandler } from '../../src/write-side/command-handlers/follow-command-handler';
import {
  updateUserDetailsCommandHandler,
  recordEvaluationPublicationCommandHandler,
  createListCommandHandler,
  removeArticleFromListCommandHandler,
  createUserAccountCommandHandler,
} from '../../src/write-side/command-handlers';
import { unfollowCommandHandler } from '../../src/write-side/command-handlers/unfollow-command-handler';
import { CommandHandler } from '../../src/write-side/command-handlers/command-handler';
import {
  AddGroupCommand, AnnotateArticleInListCommand, UpdateEvaluationCommand, UpdateGroupDetailsCommand,
} from '../../src/write-side/commands';
import { addArticleToListCommandHandler } from '../../src/write-side/command-handlers/add-article-to-list-command-handler';
import { createInMemoryEventStore } from './create-in-memory-event-store';
import { dummyLogger } from '../dummy-logger';

type EventStore = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type AddGroup = (adapters: EventStore) => CommandHandler<AddGroupCommand>;

const addGroup: AddGroup = (adapters) => (command) => pipe(
  adapters.getAllEvents,
  T.map(groupResource.create(command)),
  TE.chainW(adapters.commitEvents),
);

const updateEvaluation = (adapters: EventStore): CommandHandler<UpdateEvaluationCommand> => (command) => pipe(
  adapters.getAllEvents,
  T.map(evaluationResource.update(command)),
  TE.chainW(adapters.commitEvents),
);

type UpdateGroupDetails = (adapters: EventStore) => CommandHandler<UpdateGroupDetailsCommand>;

const updateGroupDetails: UpdateGroupDetails = (adapters) => (command) => pipe(
  adapters.getAllEvents,
  T.map(groupResource.update(command)),
  TE.chainW(adapters.commitEvents),
);

type CreateAnnotation = (adapters: EventStore) => CommandHandler<AnnotateArticleInListCommand>;

const createAnnotationCommandHandler: CreateAnnotation = (adapters) => (command) => pipe(
  adapters.getAllEvents,
  T.map((events) => listResource.annotate(command)(events)),
  TE.chainW(adapters.commitEvents),
);

const instantiateCommandHandlers = (eventStore: EventStore, queries: Queries) => ({
  addArticleToList: addArticleToListCommandHandler(eventStore),
  addGroup: addGroup(eventStore),
  createAnnotation: createAnnotationCommandHandler(eventStore),
  createList: createListCommandHandler(eventStore),
  createUserAccount: createUserAccountCommandHandler(eventStore),
  followGroup: followCommandHandler(eventStore),
  recordEvaluationPublication: recordEvaluationPublicationCommandHandler({ ...eventStore, ...queries }),
  removeArticleFromList: removeArticleFromListCommandHandler(eventStore),
  unfollowGroup: unfollowCommandHandler(eventStore),
  updateEvaluation: updateEvaluation(eventStore),
  updateGroupDetails: updateGroupDetails(eventStore),
  updateUserDetails: updateUserDetailsCommandHandler(eventStore),
});

export type ReadAndWriteSides = {
  commandHandlers: ReturnType<typeof instantiateCommandHandlers>,
  commitEvents: CommitEvents,
  getAllEvents: GetAllEvents,
  queries: Queries,
};

export const createReadAndWriteSides = (): ReadAndWriteSides => {
  const { dispatchToAllReadModels, queries } = dispatcher(dummyLogger);
  const eventStore = createInMemoryEventStore(dispatchToAllReadModels);
  const commandHandlers = instantiateCommandHandlers(eventStore, queries);
  return {
    commandHandlers,
    ...eventStore,
    queries,
  };
};
