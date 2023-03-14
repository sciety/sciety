import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { shouldNotBeCalled } from '../should-not-be-called';
import { ReadAndWriteSides } from './create-read-and-write-sides';
import { UserDetails } from '../../src/types/user-details';
import { Group } from '../../src/types/group';
import { UserId } from '../../src/types/user-id';
import { GroupId } from '../../src/types/group-id';
import { List } from '../../src/types/list';
import { ListId } from '../../src/types/list-id';
import { Doi } from '../../src/types/doi';

export type CommandHelpers = {
  addArticleToList: (articleId: Doi, listId: ListId) => Promise<unknown>,
  createGroup: (group: Group) => Promise<unknown>,
  createList: (list: List) => Promise<unknown>,
  createUserAccount: (user: UserDetails) => Promise<unknown>,
  followGroup: (userId: UserId, groupId: GroupId) => Promise<unknown>,
  removeArticleFromList: (articleId: Doi, listId: ListId) => Promise<unknown>,
};

export const createCommandHelpers = (commandHandlers: ReadAndWriteSides['commandHandlers']): CommandHelpers => ({
  addArticleToList: async (articleId, listId) => pipe(
    {
      articleId,
      listId,
    },
    commandHandlers.addArticleToList,
    TE.getOrElse(shouldNotBeCalled),
  )(),
  createGroup: async (group) => commandHandlers.createGroup({
    groupId: group.id,
    name: group.name,
    shortDescription: group.shortDescription,
    homepage: group.homepage,
    avatarPath: group.avatarPath,
    descriptionPath: group.descriptionPath,
    slug: group.slug,
  })(),
  createList: async (list) => pipe(
    {
      listId: list.id,
      ownerId: list.ownerId,
      name: list.name,
      description: list.description,
    },
    commandHandlers.createList,
    TE.getOrElse(shouldNotBeCalled),
  )(),
  createUserAccount: async (user) => pipe(
    {
      userId: user.id,
      handle: user.handle,
      avatarUrl: user.avatarUrl,
      displayName: user.displayName,
    },
    commandHandlers.createUserAccount,
    TE.getOrElse(shouldNotBeCalled),
  )(),
  followGroup: async (userId, groupId) => commandHandlers.followGroup(userId, groupId)(),
  removeArticleFromList: async (articleId, listId) => pipe(
    {
      articleId,
      listId,
    },
    commandHandlers.removeArticleFromList,
    TE.getOrElse(shouldNotBeCalled),
  )(),
});
