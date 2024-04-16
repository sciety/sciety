import * as O from 'fp-ts/Option';
import { constructListsTab } from '../../../../../src/html-pages/user-page/user-lists-page/construct-view-model/construct-lists-tab';
import { UserDetails } from '../../../../../src/types/user-details';
import { arbitraryString } from '../../../../helpers';
import { arbitraryList } from '../../../../read-models/lists/list-helper';
import { arbitraryUserHandle } from '../../../../types/user-handle.helper';
import { arbitraryUserId } from '../../../../types/user-id.helper';

const arbitraryUserDetails = (): UserDetails => ({
  id: arbitraryUserId(),
  displayName: arbitraryString(),
  handle: arbitraryUserHandle(),
});

describe('construct-lists-tab', () => {
  const pageOwner = arbitraryUserDetails();

  describe('showCreateNewList', () => {
    const lists = [arbitraryList()];

    describe('when there is a logged in user', () => {
      describe('and the logged in user also owns the page', () => {
        const user = O.some(pageOwner.id);

        it('the button should be shown', () => {
          const viewmodel = constructListsTab(lists, pageOwner, user);

          expect(viewmodel.showCreateNewList).toBe(true);
        });
      });

      describe('and the logged in user does not own the page', () => {
        const user = O.some(arbitraryUserId());

        it('the button should not be shown', () => {
          const viewmodel = constructListsTab(lists, pageOwner, user);

          expect(viewmodel.showCreateNewList).toBe(false);
        });
      });
    });

    describe('when there is no logged in user', () => {
      it('the button should not be shown', () => {
        const viewmodel = constructListsTab(lists, pageOwner, O.none);

        expect(viewmodel.showCreateNewList).toBe(false);
      });
    });
  });

  describe('ownedLists', () => {
    describe('when the user owns two lists', () => {
      const lists = [arbitraryList(), arbitraryList()];

      it('the page displays two list cards', () => {
        const viewmodel = constructListsTab(lists, pageOwner, O.none);

        expect(viewmodel.ownedLists).toHaveLength(2);
      });
    });
  });
});
