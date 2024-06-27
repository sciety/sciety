import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CommandHandler, GenericCommand } from '../../src/types/command-handler';
import { CommandResult } from '../../src/types/command-result';
import {
  AddArticleToListCommand,
  AddGroupCommand,
  AnnotateArticleInListCommand,
  AssignUserAsGroupAdminCommand,
  CreateUserAccountCommand, FollowCommand,
  PromoteListCommand,
  RecordEvaluationPublicationCommand,
  RemoveArticleFromListCommand,
  RemoveListPromotionCommand,
  UnfollowCommand,
  UpdateEvaluationCommand,
  UpdateGroupDetailsCommand,
  UpdateUserDetailsCommand,
} from '../../src/write-side/commands';
import { CreateListCommand } from '../../src/write-side/commands/create-list';
import * as evaluation from '../../src/write-side/resources/evaluation';
import {
  Dependencies as DependenciesForExecuteResourceAction,
  executeResourceAction,
} from '../../src/write-side/resources/execute-resource-action';
import * as group from '../../src/write-side/resources/group';
import * as groupAuthorisation from '../../src/write-side/resources/group-authorisation';
import * as groupFollowResource from '../../src/write-side/resources/group-follow';
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
  followGroup: (command: FollowCommand) => Promise<unknown>,
  promoteList: (command: PromoteListCommand) => Promise<unknown>,
  recordEvaluationPublication: (command: RecordEvaluationPublicationCommand) => Promise<unknown>,
  removeArticleFromList: (command: RemoveArticleFromListCommand) => Promise<unknown>,
  unfollowGroup: (command: UnfollowCommand) => Promise<unknown>,
  unpromoteList: (command: RemoveListPromotionCommand) => Promise<unknown>,
  updateEvaluation: (command: UpdateEvaluationCommand) => Promise<unknown>,
  updateGroupDetails: (command: UpdateGroupDetailsCommand) => Promise<unknown>,
  updateUserDetails: (command: UpdateUserDetailsCommand) => Promise<unknown>,
};

const invoke = (name: string) => <C extends GenericCommand>(
  handler: CommandHandler<C>,
) => async (cmd: C): Promise<CommandResult> => pipe(
    cmd,
    handler,
    TE.getOrElse(abortTest(`${name} helper`)),
  )();

export const createCommandHelpers = (
  dependencies: DependenciesForExecuteResourceAction,
): CommandHelpers => ({
  addArticleToList: invoke('addArticleToList')(executeResourceAction(dependencies)(listResource.addArticle)),
  addGroup: invoke('addGroup')(executeResourceAction(dependencies)(group.create)),
  assignUserAsGroupAdmin: invoke('assignUserAsGroupAdmin')(executeResourceAction(dependencies)(groupAuthorisation.assign)),
  createAnnotation: invoke('createAnnotation')(executeResourceAction(dependencies)(listResource.annotate)),
  createList: invoke('createList')(executeResourceAction(dependencies)(listResource.create)),
  createUserAccount: invoke('createUserAccount')(executeResourceAction(dependencies)(user.create)),
  followGroup: invoke('followGroup')(executeResourceAction(dependencies)(groupFollowResource.follow)),
  promoteList: invoke('promoteList')(executeResourceAction(dependencies)(listPromotionResource.create)),
  recordEvaluationPublication: invoke('recordEvaluationPublication')(executeResourceAction(dependencies)(evaluation.recordPublication)),
  removeArticleFromList: invoke('removeArticleFromList')(executeResourceAction(dependencies)(listResource.removeArticle)),
  unfollowGroup: invoke('unfollowGroup')(executeResourceAction(dependencies)(groupFollowResource.unfollow)),
  unpromoteList: invoke('unpromoteList')(executeResourceAction(dependencies)(listPromotionResource.remove)),
  updateEvaluation: invoke('updateEvaluation')(executeResourceAction(dependencies)(evaluation.update)),
  updateGroupDetails: invoke('updateGroupDetails')(executeResourceAction(dependencies)(group.update)),
  updateUserDetails: invoke('updateUserDetails')(executeResourceAction(dependencies)(user.update)),
});
