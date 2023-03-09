/* eslint-disable no-console */
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
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

type EventStore = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

describe('create user list', () => {
  let queries: GroupFollowersPagePorts;
  let allEvents: Array<DomainEvent>;
  let eventStore: EventStore;

  beforeEach(() => {
    allEvents = [];
    eventStore = {
      getAllEvents: T.of(allEvents),
      commitEvents: () => T.of('no-events-created' as const),
    };
    ({ queries } = dispatcher());
  });

  describe('given a user who is following a group', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = arbitraryUserDetails();
    const group = arbitraryGroup();

    beforeEach(async () => {
      console.log('COMMAND: create user');
      await createGroup(eventStore)({
        groupId: group.id,
        name: group.name,
        shortDescription: group.shortDescription,
        homepage: group.homepage,
        avatarPath: group.avatarPath,
        descriptionPath: group.descriptionPath,
        slug: group.slug,
      })();
      console.log('COMMAND: user follows group');
    });

    describe('when the user creates a new list', () => {
      beforeEach(() => {
        console.log('COMMAND: create user list');
      });

      describe('on the user-lists page', () => {
        beforeEach(() => {
          console.log('VIEWMODEL: user-lists page');
        });

        it.todo('the tabs count the list');

        it.todo('there is a card for the list');
      });

      describe.skip('on the group-followers page', () => {
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
