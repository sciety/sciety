/* eslint-disable no-console */
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
import * as RA from 'fp-ts/ReadonlyArray';
import * as LOID from '../../src/types/list-owner-id';
import {
  constructViewModel as constructGroupFollowersPage,
  Ports as GroupFollowersPagePorts,
} from '../../src/html-pages/group-page/group-followers-page/construct-view-model/construct-view-model'; import { ViewModel as GroupFollowersPage } from '../../src/html-pages/group-page/group-followers-page/view-model';
import { dispatcher } from '../../src/infrastructure/dispatcher';
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

describe('create user list', () => {
  let queries: GroupFollowersPagePorts;
  let dispatchToAllReadModels: (events: ReadonlyArray<DomainEvent>) => void;
  let allEvents: Array<DomainEvent>;
  let eventStore: EventStore;

  beforeEach(() => {
    allEvents = [];
    ({ dispatchToAllReadModels, queries } = dispatcher());
    eventStore = {
      getAllEvents: T.of(allEvents),
      commitEvents: commitEvents(allEvents, dispatchToAllReadModels),
    };
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
        createUserAccountCommandHandler(eventStore),
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
      await followCommand(eventStore)(user.id, group.id)();
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
        beforeEach(() => {
          console.log('VIEWMODEL: user-lists page');
        });

        it.todo('the tabs count the list');

        it.todo('there is a card for the list');
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
            TE.mapLeft((error) => { console.log('>>>', error); return error; }),
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
