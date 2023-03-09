import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
import * as RA from 'fp-ts/ReadonlyArray';
import { ListsTab, ViewModel as UserListsPage } from '../../src/html-pages/user-page/view-model';
import { constructViewModel as constructUserListsPage } from '../../src/html-pages/user-page/construct-view-model';
import * as LOID from '../../src/types/list-owner-id';
import {
  constructViewModel as constructGroupFollowersPage,
} from '../../src/html-pages/group-page/group-followers-page/construct-view-model/construct-view-model'; import { ViewModel as GroupFollowersPage } from '../../src/html-pages/group-page/group-followers-page/view-model';
import { Dispatcher, dispatcher } from '../../src/infrastructure/dispatcher';
import { createGroup } from '../../src/write-side/add-group';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryGroup } from '../types/group.helper';
import { arbitraryUserDetails } from '../types/user-details.helper';
import { DomainEvent } from '../../src/domain-events';
import { GetAllEvents, CommitEvents } from '../../src/shared-ports';
import { CommandResult } from '../../src/types/command-result';
import { createUserAccountCommandHandler } from '../../src/write-side/create-user-account';
import { followCommand } from '../../src/write-side/follow/follow-command';
import { createListCommandHandler } from '../../src/write-side/create-list';
import { arbitraryList } from '../types/list-helper';
import { CandidateUserHandle } from '../../src/types/candidate-user-handle';

type EventStore = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

const commitEvents = (
  inMemoryEvents: Array<DomainEvent>,
  dispatchToAllReadModels: (events: ReadonlyArray<DomainEvent>) => void,
): CommitEvents => (events) => pipe(
  events,
  RA.match(
    () => ('no-events-created' as CommandResult),
    (es) => {
      pipe(
        es,
        RA.map((event) => { inMemoryEvents.push(event); return event; }),
      );
      dispatchToAllReadModels(es);
      return 'events-created' as CommandResult;
    },
  ),
  T.of,
);

const setup = () => {
  const allEvents: Array<DomainEvent> = [];
  const { dispatchToAllReadModels, queries } = dispatcher();
  const eventStore = {
    getAllEvents: T.of(allEvents),
    commitEvents: commitEvents(allEvents, dispatchToAllReadModels),
  };
  const commandHandlers = {
    createUserAccount: createUserAccountCommandHandler(eventStore),
    followGroup: followCommand(eventStore),
  };
  return {
    eventStore,
    queries,
    commandHandlers,
  };
};

describe('create user list', () => {
  let queries: Dispatcher['queries'];
  let eventStore: EventStore;
  let commandHandlers: ReturnType<typeof setup>['commandHandlers'];

  beforeEach(() => {
    ({ queries, eventStore, commandHandlers } = setup());
  });

  describe('given a user who is following a group', () => {
    const user = arbitraryUserDetails();
    const group = arbitraryGroup();

    beforeEach(async () => {
      await pipe(
        {
          userId: user.id,
          handle: user.handle,
          avatarUrl: user.avatarUrl,
          displayName: user.displayName,
        },
        commandHandlers.createUserAccount,
        TE.getOrElse(shouldNotBeCalled),
      )();
      await createGroup(eventStore)({
        groupId: group.id,
        name: group.name,
        shortDescription: group.shortDescription,
        homepage: group.homepage,
        avatarPath: group.avatarPath,
        descriptionPath: group.descriptionPath,
        slug: group.slug,
      })();
      await commandHandlers.followGroup(user.id, group.id)();
    });

    describe('when the user creates a new list', () => {
      const list = {
        ...arbitraryList(),
        ownerId: LOID.fromUserId(user.id),
      };

      beforeEach(async () => {
        await pipe(
          {
            listId: list.id,
            ownerId: list.ownerId,
            name: list.name,
            description: list.description,
          },
          createListCommandHandler(eventStore),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      describe('on the user-lists page', () => {
        let userListsPage: UserListsPage;

        beforeEach(async () => {
          userListsPage = await pipe(
            {
              handle: user.handle as string as CandidateUserHandle,
              user: O.none,
            },
            constructUserListsPage('lists', { ...queries, getAllEvents: eventStore.getAllEvents }),
            TE.getOrElse(shouldNotBeCalled),
          )();
        });

        it('the tabs count the list', () => {
          expect(userListsPage.listCount).toBe(2);
        });

        it('there is a card for the list', () => {
          const listIds = pipe(
            userListsPage.activeTab,
            O.fromPredicate((tab): tab is ListsTab => tab.selector === 'lists'),
            O.getOrElseW(shouldNotBeCalled),
            (tab) => tab.ownedLists,
            RA.map((l) => l.listId),
          );

          expect(listIds).toContain(list.id);
        });
      });

      describe('on the group-followers page', () => {
        let groupFollowersPage: GroupFollowersPage;

        beforeEach(async () => {
          groupFollowersPage = await pipe(
            {
              slug: group.slug,
              user: O.none,
              page: 1,
            },
            constructGroupFollowersPage(queries),
            TE.getOrElse(shouldNotBeCalled),
          )();
        });

        it.failing('the user card counts the extra list', () => {
          expect(groupFollowersPage.followers[0].listCount).toBe(2);
        });
      });
    });
  });
});
