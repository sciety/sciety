import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
import { CreateListCommand } from '../../src/write-side/commands/create-list';
import { ReadAndWriteSides } from './create-read-and-write-sides';
import { UserId } from '../../src/types/user-id';
import { GroupId } from '../../src/types/group-id';
import { ListId } from '../../src/types/list-id';
import { ArticleId } from '../../src/types/article-id';
import { abortTest } from './abort-test';
import { CommandHandler, GenericCommand } from '../../src/types/command-handler';
import { CommandResult } from '../../src/types/command-result';
import {
  AddGroupCommand,
  AnnotateArticleInListCommand,
  CreateUserAccountCommand,
  RecordEvaluationPublicationCommand,
  UpdateEvaluationCommand,
} from '../../src/write-side/commands';
import { update } from '../../src/write-side/resources/evaluation';
import { ResourceAction } from '../../src/write-side/resources/resource-action';
import { GetAllEvents, CommitEvents } from '../../src/shared-ports';
import { DomainEvent } from '../../src/domain-events';

export type CommandHelpers = {
  addArticleToList: (articleId: ArticleId, listId: ListId) => Promise<unknown>,
  addGroup: (command: AddGroupCommand) => Promise<unknown>,
  createAnnotation: (command: AnnotateArticleInListCommand) => Promise<unknown>,
  createList: (command: CreateListCommand) => Promise<unknown>,
  createUserAccount: (command: CreateUserAccountCommand) => Promise<unknown>,
  followGroup: (userId: UserId, groupId: GroupId) => Promise<unknown>,
  recordEvaluationPublication: (command: RecordEvaluationPublicationCommand) => Promise<unknown>,
  removeArticleFromList: (articleId: ArticleId, listId: ListId) => Promise<unknown>,
  unfollowGroup: (userId: UserId, groupId: GroupId) => Promise<unknown>,
  updateEvaluation: (command: UpdateEvaluationCommand) => Promise<DomainEvent>,
  updateGroupDetails: (groupId: GroupId, largeLogoPath: string) => Promise<unknown>,
  updateUserDetails: (userId: UserId, avatarUrl?: string, displayName?: string) => Promise<unknown>,
};

const invoke = <C extends GenericCommand>(
  handler: CommandHandler<C>,
  name: string,
) => async (cmd: C): Promise<CommandResult> => pipe(
    cmd,
    handler,
    TE.getOrElse(abortTest(`${name} helper`)),
  )();

const invokeResourceAction = <C extends GenericCommand>(
  eventStore: EventStore,
  action: ResourceAction<C>,
  name: string,
) => async (cmd: C): Promise<DomainEvent> => pipe(
    eventStore.getAllEvents,
    TE.rightTask,
    TE.chainEitherK(action(cmd)),
    TE.getOrElse(abortTest(`${name} helper`)),
    T.chain(() => eventStore.getAllEvents),
    T.map((events) => events[events.length - 1]),
  )();

type EventStore = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

export const createCommandHelpers = (commandHandlers: ReadAndWriteSides['commandHandlers'], eventStore: EventStore): CommandHelpers => ({
  addArticleToList: async (articleId, listId) => pipe(
    {
      articleId,
      listId,
    },
    invoke(commandHandlers.addArticleToList, 'addArticleToList'),
  ),
  addGroup: invoke(commandHandlers.addGroup, 'addGroup'),
  createAnnotation: invoke(commandHandlers.createAnnotation, 'createAnnotation'),
  createList: invoke(commandHandlers.createList, 'createList'),
  createUserAccount: invoke(commandHandlers.createUserAccount, 'createUserAccount'),
  followGroup: async (userId, groupId) => pipe(
    { userId, groupId },
    invoke(commandHandlers.followGroup, 'followGroup'),
  ),
  recordEvaluationPublication: invoke(commandHandlers.recordEvaluationPublication, 'recordEvaluationPublication'),
  removeArticleFromList: async (articleId, listId) => pipe(
    {
      articleId,
      listId,
    },
    invoke(commandHandlers.removeArticleFromList, 'removeArticleFromList'),
  ),
  unfollowGroup: async (userId, groupId) => pipe(
    {
      userId,
      groupId,
    },
    invoke(commandHandlers.unfollowGroup, 'unfollowGroup'),
  ),
  updateEvaluation: invokeResourceAction(eventStore, update, 'updateEvaluation'),
  updateGroupDetails: async (groupId, largeLogoPath) => pipe(
    {
      groupId,
      largeLogoPath,
    },
    invoke(commandHandlers.updateGroupDetails, 'updateGroupDetails'),
  ),
  updateUserDetails: async (userId, avatarUrl, displayName) => pipe(
    {
      userId,
      avatarUrl,
      displayName,
    },
    invoke(commandHandlers.updateUserDetails, 'updateUserDetails'),
  ),
});
