import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import {
  constructViewModel as constructGroupFollowersPage,
  Ports as GroupFollowersPagePorts,
} from '../../src/html-pages/group-page/group-followers-page/construct-view-model/construct-view-model'; import { ViewModel as GroupFollowersPage } from '../../src/html-pages/group-page/group-followers-page/view-model';
import { dispatcher } from '../../src/infrastructure/dispatcher';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryGroup } from '../types/group.helper';
import { arbitraryUserDetails } from '../types/user-details.helper';

describe('create user list', () => {
  let queries: GroupFollowersPagePorts;

  beforeEach(() => {
    ({ queries } = dispatcher());
  });

  describe('given a user who is following a group', () => {
    const user = arbitraryUserDetails();
    const group = arbitraryGroup();

    beforeEach(() => {
      console.log('COMMAND: create user');
      console.log('COMMAND: create group');
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
