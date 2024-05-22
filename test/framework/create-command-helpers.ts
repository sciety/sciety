import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ReadAndWriteSides } from './create-read-and-write-sides';
import { ArticleId } from '../../src/types/article-id';
import { CommandHandler, GenericCommand } from '../../src/types/command-handler';
import { CommandResult } from '../../src/types/command-result';
import { GroupId } from '../../src/types/group-id';
import { ListId } from '../../src/types/list-id';
import { UserId } from '../../src/types/user-id';
import {
  AddGroupCommand,
  AnnotateArticleInListCommand,
  CreateUserAccountCommand,
  RecordEvaluationPublicationCommand,
  UpdateEvaluationCommand,
} from '../../src/write-side/commands';
import { CreateListCommand } from '../../src/write-side/commands/create-list';
import { Dependencies as DependenciesForExecuteResourceAction } from '../../src/write-side/resources/execute-resource-action';
import { abortTest } from '../abort-test';

export type CommandHelpers = {
  addArticleToList: (articleId: ArticleId, listId: ListId) => Promise<unknown>,
  addGroup: (command: AddGroupCommand) => Promise<unknown>,
  assignUserAsGroupAdmin: (command: unknown) => Promise<unknown>,
  createAnnotation: (command: AnnotateArticleInListCommand) => Promise<unknown>,
  createList: (command: CreateListCommand) => Promise<unknown>,
  createUserAccount: (command: CreateUserAccountCommand) => Promise<unknown>,
  followGroup: (userId: UserId, groupId: GroupId) => Promise<unknown>,
  recordEvaluationPublication: (command: RecordEvaluationPublicationCommand) => Promise<unknown>,
  removeArticleFromList: (articleId: ArticleId, listId: ListId) => Promise<unknown>,
  unfollowGroup: (userId: UserId, groupId: GroupId) => Promise<unknown>,
  updateEvaluation: (command: UpdateEvaluationCommand) => Promise<unknown>,
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

export const createCommandHelpers = (
  dependencies: DependenciesForExecuteResourceAction,
  commandHandlers: ReadAndWriteSides['commandHandlers'],
): CommandHelpers => ({
  addArticleToList: async (articleId, listId) => pipe(
    {
      articleId,
      listId,
    },
    invoke(commandHandlers.addArticleToList, 'addArticleToList'),
  ),
  addGroup: invoke(commandHandlers.addGroup, 'addGroup'),
  assignUserAsGroupAdmin: async () => undefined,
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
  updateEvaluation: invoke(commandHandlers.updateEvaluation, 'updateEvaluation'),
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
