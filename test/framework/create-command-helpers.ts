import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CommandHandler, GenericCommand } from '../../src/types/command-handler';
import { CommandResult } from '../../src/types/command-result';
import { GroupId } from '../../src/types/group-id';
import { UserId } from '../../src/types/user-id';
import { unfollowCommandHandler } from '../../src/write-side/command-handlers';
import { follow } from '../../src/write-side/command-handlers/follow-command-handler';
import {
  AddArticleToListCommand,
  AddGroupCommand,
  AnnotateArticleInListCommand,
  AssignUserAsGroupAdminCommand,
  CreateUserAccountCommand,
  PromoteListCommand,
  RecordEvaluationPublicationCommand,
  RemoveArticleFromListCommand,
  RemoveListPromotionCommand,
  UpdateEvaluationCommand,
  UpdateGroupDetailsCommand,
} from '../../src/write-side/commands';
import { CreateListCommand } from '../../src/write-side/commands/create-list';
import * as evaluation from '../../src/write-side/resources/evaluation';
import {
  Dependencies as DependenciesForExecuteResourceAction,
  executeResourceAction,
} from '../../src/write-side/resources/execute-resource-action';
import * as group from '../../src/write-side/resources/group';
import * as groupAuthorisation from '../../src/write-side/resources/group-authorisation';
import * as listResource from '../../src/write-side/resources/list';
import * as listPromotionResource from '../../src/write-side/resources/list-promotion';
import * as user from '../../src/write-side/resources/user';
import { abortTest } from '../abort-test';

export type CommandHelpers = {
  addArticleToList: (command: AddArticleToListCommand) => Promise<unknown>,
  addGroup: (command: AddGroupCommand) => Promise<unknown>,
  assignUserAsGroupAdmin: (command: AssignUserAsGroupAdminCommand) => Promise<unknown>,
  createAnnotation: (command: AnnotateArticleInListCommand) => Promise<unknown>,
  createList: (command: CreateListCommand) => Promise<unknown>,
  createUserAccount: (command: CreateUserAccountCommand) => Promise<unknown>,
  followGroup: (userId: UserId, groupId: GroupId) => Promise<unknown>,
  promoteList: (command: PromoteListCommand) => Promise<unknown>,
  recordEvaluationPublication: (command: RecordEvaluationPublicationCommand) => Promise<unknown>,
  removeArticleFromList: (command: RemoveArticleFromListCommand) => Promise<unknown>,
  unfollowGroup: (userId: UserId, groupId: GroupId) => Promise<unknown>,
  unpromoteList: (command: RemoveListPromotionCommand) => Promise<unknown>,
  updateEvaluation: (command: UpdateEvaluationCommand) => Promise<unknown>,
  updateGroupDetails: (command: UpdateGroupDetailsCommand) => Promise<unknown>,
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
): CommandHelpers => ({
  addArticleToList: invoke(executeResourceAction(dependencies, listResource.addArticle), 'addArticleToList'),
  addGroup: invoke(executeResourceAction(dependencies, group.create), 'addGroup'),
  assignUserAsGroupAdmin: invoke(executeResourceAction(dependencies, groupAuthorisation.assign), 'assignUserAsGroupAdmin'),
  createAnnotation: invoke(executeResourceAction(dependencies, listResource.annotate), 'createAnnotation'),
  createList: invoke(executeResourceAction(dependencies, listResource.create), 'createList'),
  createUserAccount: invoke(executeResourceAction(dependencies, user.create), 'createUserAccount'),
  followGroup: async (userId, groupId) => pipe(
    { userId, groupId },
    invoke(executeResourceAction(dependencies, follow), 'followGroup'),
  ),
  promoteList: invoke(executeResourceAction(dependencies, listPromotionResource.create), 'promoteList'),
  recordEvaluationPublication: invoke(executeResourceAction(dependencies, evaluation.recordPublication), 'recordEvaluationPublication'),
  removeArticleFromList: invoke(executeResourceAction(dependencies, listResource.removeArticle), 'removeArticleFromList'),
  unfollowGroup: async (userId, groupId) => pipe(
    {
      userId,
      groupId,
    },
    invoke(unfollowCommandHandler(dependencies), 'unfollowGroup'),
  ),
  unpromoteList: invoke(executeResourceAction(dependencies, listPromotionResource.remove), 'unpromoteList'),
  updateEvaluation: invoke(executeResourceAction(dependencies, evaluation.update), 'updateEvaluation'),
  updateGroupDetails: invoke(executeResourceAction(dependencies, group.update), 'updateGroupDetails'),
  updateUserDetails: async (userId, avatarUrl, displayName) => pipe(
    {
      userId,
      avatarUrl,
      displayName,
    },
    invoke(executeResourceAction(dependencies, user.update), 'updateUserDetails'),
  ),
});
