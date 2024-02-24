import * as E from 'fp-ts/Either';
import { identity, pipe } from 'fp-ts/function';
import { arbitraryCreateListCommand } from '../../write-side/commands/create-list-command.helper.js';
import { TestFramework, createTestFramework } from '../../framework/create-test-framework.js';
import { constructViewModel } from '../../../src/html-pages/edit-list-details-form-page/construct-view-model.js';
import { shouldNotBeCalled } from '../../should-not-be-called.js';
import { arbitraryListId } from '../../types/list-id.helper.js';
import { ViewModel } from '../../../src/html-pages/edit-list-details-form-page/render-edit-list-details-form-page.js';

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
    let result: 'no-such-list';

    beforeEach(() => {
      result = pipe(
        listId,
        constructViewModel(framework.dependenciesForViews),
        E.match(
          identity,
          shouldNotBeCalled,
        ),
      );
    });

    it('fails with an appropriate message', () => {
      expect(result).toBe('no-such-list');
    });
  });
});
