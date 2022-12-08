import * as O from 'fp-ts/Option';
import { constructViewModel } from '../../src/edit-list-details-form-page/construct-view-model';
import { arbitraryList } from '../types/list-helper';
import { arbitraryListId } from '../types/list-id.helper';

describe('construct-view-model', () => {
  describe('when the list exists', () => {
    const listId = arbitraryListId();
    const list = arbitraryList();
    const adapters = {
      getList: () => O.some(list),
    };
    const viewModel = constructViewModel(adapters)(listId);

    it('includes the list id', () => {
      expect(viewModel.id).toStrictEqual(listId);
    });

    it.failing('includes the current list name', () => {
      expect(viewModel.name).toStrictEqual(list.name);
    });

    it.todo('includes the current list description');
  });

  describe('when the list does not exist', () => {
    it.todo('returns on left');
  });
});
