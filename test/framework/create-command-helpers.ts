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
import { CommandResult } from '../../src/types/command-result';

export type CommandHelpers = {
  addArticleToList: (articleId: Doi, listId: ListId) => Promise<unknown>,
  createGroup: (group: Group) => Promise<unknown>,
  createList: (list: List) => Promise<unknown>,
  createUserAccount: (user: UserDetails) => Promise<unknown>,
  followGroup: (userId: UserId, groupId: GroupId) => Promise<unknown>,
  recordEvaluation: (evaluation: RecordedEvaluation) => Promise<unknown>,
  removeArticleFromList: (articleId: Doi, listId: ListId) => Promise<unknown>,
  updateUserDetails: (userId: UserId, avatarUrl?: string, displayName?: string) => Promise<unknown>,
};

type Outcome = TE.TaskEither<string, CommandResult>;

const invoke = <C>(handler: (a: C) => Outcome, name: string) => (cmd: C) => {
  if (process.env.TEST_DEBUG === 'true') {
    // eslint-disable-next-line no-console
    console.log(`${name}:`, cmd);
  }
  return pipe(
    cmd,
    handler,
    TE.getOrElse(abortTest(`${name} helper`)),
  );
};

export const createCommandHelpers = (commandHandlers: ReadAndWriteSides['commandHandlers']): CommandHelpers => ({
  addArticleToList: async (articleId, listId) => pipe(
    {
      articleId,
      listId,
    },
    invoke(commandHandlers.addArticleToList, 'addArticleToList'),
  )(),
  createGroup: async (group) => pipe(
    {
      groupId: group.id,
      name: group.name,
      shortDescription: group.shortDescription,
      homepage: group.homepage,
      avatarPath: group.avatarPath,
      descriptionPath: group.descriptionPath,
      slug: group.slug,
    },
    invoke(commandHandlers.createGroup, 'createGroup'),
  )(),
  createList: async (list) => pipe(
    {
      listId: list.id,
      ownerId: list.ownerId,
      name: list.name,
      description: list.description,
    },
    invoke(commandHandlers.createList, 'createList'),
  )(),
  createUserAccount: async (user) => pipe(
    {
      userId: user.id,
      handle: user.handle,
      avatarUrl: user.avatarUrl,
      displayName: user.displayName,
    },
    invoke(commandHandlers.createUserAccount, 'createUserAccount'),
  )(),
  followGroup: async (userId, groupId) => pipe(
    { userId, groupId },
    invoke(flow(commandHandlers.followGroup, TE.rightTask), 'followGroup'),
  )(),
  recordEvaluation: async (evaluation: RecordedEvaluation) => pipe(
    {
      ...evaluation,
      evaluationLocator: evaluation.reviewId,
    },
    invoke(commandHandlers.recordEvaluation, 'recordEvaluation'),
  )(),
  removeArticleFromList: async (articleId, listId) => pipe(
    {
      articleId,
      listId,
    },
    invoke(commandHandlers.removeArticleFromList, 'removeArticleFromList'),
  )(),
  updateUserDetails: async (userId, avatarUrl, displayName) => pipe(
    {
      id: userId,
      avatarUrl: O.fromNullable(avatarUrl),
      displayName: O.fromNullable(displayName),
    },
    invoke(commandHandlers.updateUserDetails, 'updateUserDetails'),
  )(),
});
