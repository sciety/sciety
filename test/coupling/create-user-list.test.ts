import { ViewModel as GroupFollowersPage } from '../../src/html-pages/group-page/group-followers-page/view-model';

describe('create user list', () => {
  describe('given a user who is following a group', () => {
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

        beforeEach(() => {
          console.log('VIEWMODEL: group-followers page');
        });

        it.failing('the user card counts the extra list', () => {
          expect(groupFollowersPage.followers[0].listCount).toBe(2);
        });
      });
    });
  });
});
