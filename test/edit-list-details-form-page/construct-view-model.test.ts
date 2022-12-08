import { constructViewModel } from '../../src/edit-list-details-form-page/construct-view-model';
import { arbitraryListId } from '../types/list-id.helper';

describe('construct-view-model', () => {
  describe('when the list exists', () => {
    const listId = arbitraryListId();
    const viewModel = constructViewModel(listId);

    it('includes the list id', () => {
      expect(viewModel.id).toStrictEqual(listId);
    });

    it.todo('includes the current list name');

    it.todo('includes the current list description');
  });

  describe('when the list does not exist', () => {
    it.todo('returns on left');
  });
});
