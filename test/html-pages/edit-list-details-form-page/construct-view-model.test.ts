import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { arbitraryCreateListCommand } from '../../write-side/commands/create-list-command.helper';
import { TestFramework, createTestFramework } from '../../framework/create-test-framework';
import { constructViewModel } from '../../../src/html-pages/edit-list-details-form-page/construct-view-model';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryListId } from '../../types/list-id.helper';
import { ViewModel } from '../../../src/html-pages/edit-list-details-form-page/render-edit-list-details-form-page';

describe('construct-view-model', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the list exists', () => {
    const command = arbitraryCreateListCommand();
    let viewModel: ViewModel;

    beforeEach(async () => {
      await framework.commandHelpers.createList(command);
      viewModel = pipe(
        command.listId,
        constructViewModel(framework.dependenciesForViews),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it('includes the list id', () => {
      expect(viewModel.listId).toStrictEqual(command.listId);
    });

    it('includes the current list name', () => {
      expect(viewModel.listName).toStrictEqual(command.name);
    });

    it('includes the current list description', () => {
      expect(viewModel.listDescription).toStrictEqual(command.description);
    });
  });

  describe('when the list does not exist', () => {
    const listId = arbitraryListId();
    const adapters = {
      lookupList: () => O.none,
    };
    const result = pipe(
      listId,
      constructViewModel(adapters),
    );

    it('returns on left', () => {
      expect(result).toStrictEqual(E.left('no-such-list'));
    });
  });
});
