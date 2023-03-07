import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import {DomainEvent} from '../../src/domain-events';
import {
  constructViewModel as constructGroupFollowersPage,
  Ports as GroupFollowersPagePorts,
} from '../../src/html-pages/group-page/group-followers-page/construct-view-model/construct-view-model'; import { ViewModel as GroupFollowersPage } from '../../src/html-pages/group-page/group-followers-page/view-model';
import { dispatcher } from '../../src/infrastructure/dispatcher';
import {CommitEvents} from '../../src/shared-ports';
import {CommandResult} from '../../src/types/command-result';
import { createGroup } from '../../src/write-side/add-group';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryGroup } from '../types/group.helper';
import { arbitraryUserDetails } from '../types/user-details.helper';

const commitEvents = ({
  inMemoryEvents,
  dispatchToAllReadModels,
}: Dependencies): CommitEvents => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.match(
    () => T.of('no-events-created' as CommandResult),
    (es) => pipe(
      es,
      RA.map((event) => inMemoryEvents.push(event)),
      dispatchToAllReadModels,
      () => 'events-created' as CommandResult),
    ),
  ),
);

describe('create user list', () => {
  let queries: GroupFollowersPagePorts;
  let eventStore: unknown;

  beforeEach(() => {
    ({ queries } = dispatcher());
  });

  describe('given a user who is following a group', () => {
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
