import { flow, pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { ReadAndWriteSides } from './create-read-and-write-sides';
import { UserDetails } from '../../src/types/user-details';
import { Group } from '../../src/types/group';
import { UserId } from '../../src/types/user-id';
import { GroupId } from '../../src/types/group-id';
import { List } from '../../src/types/list';
import { ListId } from '../../src/types/list-id';
import { Doi } from '../../src/types/doi';
import { RecordedEvaluation } from '../../src/types/recorded-evaluation';
import { abortTest } from './abort-test';
import { CommandHandler, GenericCommand } from '../../src/types/command-handler';
import { CommandResult } from '../../src/types/command-result';
import { AddGroupCommand, RecordEvaluationPublicationCommand } from '../../src/write-side/commands';

export type CommandHelpers = {
  addArticleToList: (articleId: Doi, listId: ListId) => Promise<unknown>,
  addGroup: (command: AddGroupCommand) => Promise<unknown>,
  deprecatedCreateGroup: (group: Group) => Promise<unknown>,
  createList: (list: List) => Promise<unknown>,
  createUserAccount: (user: UserDetails) => Promise<unknown>,
  followGroup: (userId: UserId, groupId: GroupId) => Promise<unknown>,
  deprecatedRecordEvaluation: (evaluation: RecordedEvaluation) => Promise<unknown>,
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
  deprecatedCreateGroup: async (group) => pipe(
    {
      groupId: group.id,
      name: group.name,
      shortDescription: group.shortDescription,
      homepage: group.homepage,
      avatarPath: group.avatarPath,
      descriptionPath: group.descriptionPath,
      slug: group.slug,
    },
    invoke(commandHandlers.addGroup, 'addGroup'),
  ),
  createList: async (list) => pipe(
    {
      listId: list.id,
      ownerId: list.ownerId,
      name: list.name,
      description: list.description,
    },
    invoke(commandHandlers.createList, 'createList'),
  ),
  createUserAccount: async (user) => pipe(
    {
      userId: user.id,
      handle: user.handle,
      avatarUrl: user.avatarUrl,
      displayName: user.displayName,
    },
    invoke(commandHandlers.createUserAccount, 'createUserAccount'),
  ),
  followGroup: async (userId, groupId) => pipe(
    { userId, groupId },
    invoke(flow(commandHandlers.followGroup, TE.rightTask), 'followGroup'),
  ),
  deprecatedRecordEvaluation: async (evaluation: RecordedEvaluation) => pipe(
    {
      groupId: evaluation.groupId,
      publishedAt: evaluation.publishedAt,
      evaluationLocator: evaluation.evaluationLocator,
      articleId: evaluation.articleId,
      authors: evaluation.authors,
      issuedAt: evaluation.recordedAt,
      evaluationType: pipe(
        evaluation.type,
        O.getOrElseW(() => undefined),
      ),
    },
    invoke(commandHandlers.recordEvaluationPublication, 'recordEvaluationPublication'),
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
