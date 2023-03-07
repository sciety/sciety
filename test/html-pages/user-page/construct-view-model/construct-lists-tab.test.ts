import * as O from 'fp-ts/Option';
import { arbitraryList } from '../../../types/list-helper';
import { constructListsTab } from '../../../../src/html-pages/user-page/construct-view-model/construct-lists-tab';
import { arbitraryUserId } from '../../../types/user-id.helper';

describe('construct-lists-tab', () => {
  const list = arbitraryList();
  const pageOwner = arbitraryUserId();

  describe('showCreateNewList', () => {
    describe('when there is a logged in user', () => {
      describe('and the logged in user also owns the page', () => {
        const user = O.some(pageOwner);

        it('the button should be shown', () => {
          const viewmodel = constructListsTab(list, pageOwner, user);

          expect(viewmodel.showCreateNewList).toBe(true);
        });
      });

      describe('and the logged in user does not own the page', () => {
        it.todo('the button should not be shown');
      });
    });

    describe('when there is no logged in user', () => {
      it.todo('the button should not be shown');
    });
  });
});
