import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from '../../../../../src/read-side/html-pages/group-page/group-add-a-featured-list-form-page/construct-view-model';
import { GroupId } from '../../../../../src/types/group-id';
import { UserId } from '../../../../../src/types/user-id';
import { TestFramework, createTestFramework } from '../../../../framework';
import { arbitraryWord } from '../../../../helpers';
import { arbitraryUserId } from '../../../../types/user-id.helper';
import { arbitraryAddGroupCommand } from '../../../../write-side/commands/add-group-command.helper';
import { arbitraryAssignUserAsGroupAdminCommand } from '../../../../write-side/commands/assign-user-as-group-admin-command.helper';

describe('construct-view-model', () => {
  let framework: TestFramework;
  let result: ReturnType<ReturnType<typeof constructViewModel>>;

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
      const hardcodedUserId = 'auth0|650a91161c07d3acf5ff7da5' as UserId;
      const addHardcodedGroupCommand = {
        ...arbitraryAddGroupCommand(),
        groupId: 'd6e1a913-76f8-40dc-9074-8eac033e1bc8' as GroupId,
      };
      const hardcodedGroupSlug = addHardcodedGroupCommand.slug;

      beforeEach(async () => {
        await framework.commandHelpers.addGroup(addHardcodedGroupCommand);
        const assignUserAsGroupAdminCommand = {
          ...arbitraryAssignUserAsGroupAdminCommand(),
          userId: hardcodedUserId,
          groupId: addGroupCommand.groupId,
        };
        await framework.commandHelpers.assignUserAsGroupAdmin(assignUserAsGroupAdminCommand);
        result = pipe(
          {
            slug: hardcodedGroupSlug,
          },
          constructViewModel(framework.dependenciesForViews, hardcodedUserId),
        );
      });

      it('returns on the right', () => {
        expect(E.isRight(result)).toBe(true);
      });
    });

    describe('and the user is not an admin of this group', () => {
      const userId = arbitraryUserId();

      beforeEach(async () => {
        result = pipe(
          {
            slug: groupSlug,
          },
          constructViewModel(framework.dependenciesForViews, userId),
        );
      });

      it('returns on the left', () => {
        expect(E.isLeft(result)).toBe(true);
      });
    });
  });

  describe('when the group can not be found', () => {
    beforeEach(() => {
      const groupSlug = arbitraryWord();
      result = pipe(
        {
          slug: groupSlug,
        },
        constructViewModel(framework.dependenciesForViews, arbitraryUserId()),
      );
    });

    it('returns on the left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
