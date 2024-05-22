import * as E from 'fp-ts/Either';
import { constructViewModel } from '../../../../../src/read-side/html-pages/group-page/group-add-a-featured-list-form-page/construct-view-model';
import { ViewModel } from '../../../../../src/read-side/html-pages/group-page/group-add-a-featured-list-form-page/view-model';
import { TestFramework, createTestFramework } from '../../../../framework';
import { arbitraryWord } from '../../../../helpers';
import { arbitraryAddGroupCommand } from '../../../../write-side/commands/add-group-command.helper';

describe('construct-view-model', () => {
  let framework: TestFramework;
  let result: E.Either<'no-such-group', ViewModel>;

  beforeEach(async () => {
    framework = createTestFramework();
  });

  describe('when the group can be found', () => {
    const addGroupCommand = arbitraryAddGroupCommand();
    const groupSlug = addGroupCommand.slug;

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
    });

    describe('and the user is an admin of this group', () => {
      beforeEach(() => {
        result = constructViewModel(framework.dependenciesForViews)(groupSlug);
      });

      it('returns on the right', () => {
        expect(E.isRight(result)).toBe(true);
      });
    });

    describe('and the user is not an admin of this group', () => {
      it.todo('returns on the left');
    });
  });

  describe('when the group can not be found', () => {
    beforeEach(() => {
      const groupSlug = arbitraryWord();
      result = constructViewModel(framework.dependenciesForViews)(groupSlug);
    });

    it('returns on the left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
