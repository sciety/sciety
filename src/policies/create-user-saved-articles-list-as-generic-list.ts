import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../domain-events';
import { isUserSavedArticleEvent, UserSavedArticleEvent } from '../domain-events/user-saved-article-event';
import { Logger } from '../shared-ports';
import { CreateList } from '../shared-ports/create-list';
import { GetUserDetails } from '../shared-ports/get-user-details';
import * as DE from '../types/data-error';
import { ListId } from '../types/list-id';
import * as LOID from '../types/list-owner-id';
import { UserId } from '../types/user-id';

// ts-unused-exports:disable-next-line
export type Ports = {
  createList: CreateList,
  getUserDetails: GetUserDetails,
  getListsOwnedBy: (ownerId: LOID.ListOwnerId) => TE.TaskEither<DE.DataError, ReadonlyArray<{ id: ListId }>>,
  logger: Logger,
};

const filterOutUsersWithGenericLists = (getListsOwnedBy: Ports['getListsOwnedBy']) => (userSavedArticleEvent: UserSavedArticleEvent) => pipe(
  userSavedArticleEvent.userId,
  LOID.fromUserId,
  getListsOwnedBy,
  TE.filterOrElseW(RA.isEmpty, () => 'user already owns a list' as const),
);

const constructCommand = (userDetails: { userId: UserId, handle: string }) => ({
  ownerId: LOID.fromUserId(userDetails.userId),
  name: `@${userDetails.handle}'s saved articles`,
  description: `Articles that have been saved by @${userDetails.handle}`,
});

type CreateUserSavedArticlesListAsGenericList = (ports: Ports) => (event: DomainEvent) => T.Task<undefined>;

export const createUserSavedArticlesListAsGenericList: CreateUserSavedArticlesListAsGenericList = (
  ports,
) => (event) => pipe(
  event,
  TE.fromPredicate(isUserSavedArticleEvent, () => 'event not of interest' as const),
  TE.chainFirstW(filterOutUsersWithGenericLists(ports.getListsOwnedBy)),
  TE.map(({ userId }) => userId),
  TE.chainW(ports.getUserDetails),
  TE.map(constructCommand),
  TE.chainW(ports.createList),
  TE.match(
    (reason) => {
      switch (reason) {
        case 'user already owns a list':
          ports.logger('debug', 'createUserSavedArticlesListAsGenericList policy produced no action', { reason, event });
          break;
        case 'event not of interest':
          break;
        case DE.notFound:
          ports.logger('error', 'createUserSavedArticlesListAsGenericList policy failed', { reason, event });
          break;
        case DE.unavailable:
          ports.logger('error', 'createUserSavedArticlesListAsGenericList policy failed', { reason, event });
          break;
        default:
          ports.logger('error', 'createUserSavedArticlesListAsGenericList policy failed', { reason, event });
      }
      return undefined;
    },
    () => undefined,
  ),
);
