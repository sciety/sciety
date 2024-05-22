import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from '../../../../../src/read-side/html-pages/group-page/group-add-a-featured-list-form-page/construct-view-model';
import { ViewModel } from '../../../../../src/read-side/html-pages/group-page/group-add-a-featured-list-form-page/view-model';
import { TestFramework, createTestFramework } from '../../../../framework';
import { arbitraryWord } from '../../../../helpers';
import { arbitraryUserId } from '../../../../types/user-id.helper';
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
        result = pipe(
          {
            slug: groupSlug,
            user: O.some({ id: arbitraryUserId() }),
          },
          constructViewModel(framework.dependenciesForViews),
        );
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
      result = pipe(
        {
          slug: groupSlug,
          user: O.some({ id: arbitraryUserId() }),
        },
        constructViewModel(framework.dependenciesForViews),
      );
    });

    it('returns on the left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
