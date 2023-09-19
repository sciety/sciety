import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { CreateAnnotationCommand } from '../../src/annotations/execute-create-annotation-command';
import { CreateListCommand } from '../../src/write-side/commands/create-list';
import { ReadAndWriteSides } from './create-read-and-write-sides';
import { UserId } from '../../src/types/user-id';
import { GroupId } from '../../src/types/group-id';
import { ListId } from '../../src/types/list-id';
import { Doi } from '../../src/types/doi';
import { abortTest } from './abort-test';
import { CommandHandler, GenericCommand } from '../../src/types/command-handler';
import { CommandResult } from '../../src/types/command-result';
import { AddGroupCommand, CreateUserAccountCommand, RecordEvaluationPublicationCommand } from '../../src/write-side/commands';

export type CommandHelpers = {
  addArticleToList: (articleId: Doi, listId: ListId) => Promise<unknown>,
  addGroup: (command: AddGroupCommand) => Promise<unknown>,
  createAnnotation: (command: CreateAnnotationCommand) => Promise<unknown>,
  createList: (command: CreateListCommand) => Promise<unknown>,
  createUserAccount: (command: CreateUserAccountCommand) => Promise<unknown>,
  followGroup: (userId: UserId, groupId: GroupId) => Promise<unknown>,
  recordEvaluationPublication: (command: RecordEvaluationPublicationCommand) => Promise<unknown>,
  removeArticleFromList: (articleId: Doi, listId: ListId) => Promise<unknown>,
  unfollowGroup: (userId: UserId, groupId: GroupId) => Promise<unknown>,
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

export const createCommandHelpers = (commandHandlers: ReadAndWriteSides['commandHandlers']): CommandHelpers => ({
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
