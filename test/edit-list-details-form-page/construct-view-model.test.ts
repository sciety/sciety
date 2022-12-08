import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from '../../src/edit-list-details-form-page/construct-view-model';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryList } from '../types/list-helper';
import { arbitraryListId } from '../types/list-id.helper';

describe('construct-view-model', () => {
  describe('when the list exists', () => {
    const listId = arbitraryListId();
    const list = arbitraryList();
    const adapters = {
      getList: () => O.some(list),
    };
    const viewModel = pipe(
      constructViewModel(adapters)(listId),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('includes the list id', () => {
      expect(viewModel.listId).toStrictEqual(listId);
    });

    it('includes the current list name', () => {
      expect(viewModel.listName).toStrictEqual(list.name);
    });

    it('includes the current list description', () => {
      expect(viewModel.listDescription).toStrictEqual(list.description);
    });
  });

  describe('when the list does not exist', () => {
    const listId = arbitraryListId();
    const adapters = {
      getList: () => O.none,
    };
    const result = constructViewModel(adapters)(listId);

    it('returns on left', () => {
      expect(result).toStrictEqual(E.left('no-such-list'));
    });
  });
});
