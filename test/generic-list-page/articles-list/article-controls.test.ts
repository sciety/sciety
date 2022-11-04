import * as O from 'fp-ts/Option';
import { articleControls } from '../../../src/generic-list-page/articles-list/article-controls';
import { fromUserId } from '../../../src/types/list-owner-id';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('article-controls', () => {
  describe('when the list owner is a user', () => {
    describe('when the logged in user is the list owner', () => {
      const userId = arbitraryUserId();
      const listOwnerId = fromUserId(userId);
      const loggedInUserId = O.some(userId);

      it.failing('has controls', () => {
        expect(articleControls(listOwnerId, loggedInUserId)).toBe(true);
      });
    });

    describe('when the logged in user is not the list owner', () => {
      it.todo('has no controls');
    });

    describe('when the user is not logged in', () => {
      it.todo('has no controls');
    });
  });

  describe('when the list owner is a group', () => {
    it.todo('has no controls');
  });
});
