import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructListsThatCanBeFeatured } from '../../../../../../src/read-side/html-pages/group-page/group-management-page/construct-view-model/construct-lists-that-can-be-featured';
import { Group } from '../../../../../../src/types/group';
import { ListId } from '../../../../../../src/types/list-id';
import * as LOID from '../../../../../../src/types/list-owner-id';
import { TestFramework, createTestFramework } from '../../../../../framework';
import { shouldNotBeCalled } from '../../../../../should-not-be-called';
import { arbitraryArticleId } from '../../../../../types/article-id.helper';
import { arbitraryUserId } from '../../../../../types/user-id.helper';
import { arbitraryAddGroupCommand } from '../../../../../write-side/commands/add-group-command.helper';
import { arbitraryCreateListCommand } from '../../../../../write-side/commands/create-list-command.helper';

describe('construct-lists-that-can-be-featured', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('given a group', () => {
    let group: Group;

    beforeEach(async () => {
      const addGroupCommand = arbitraryAddGroupCommand();
      await framework.commandHelpers.addGroup(addGroupCommand);
      group = pipe(
        addGroupCommand.groupId,
        framework.queries.getGroup,
        O.getOrElseW(shouldNotBeCalled),
      );
    });

    describe('given a user list that is populated', () => {
      const listOwnerId = LOID.fromUserId(arbitraryUserId());
      const createListCommand = {
        ...arbitraryCreateListCommand(),
        listOwnerId,
      };
      const userListId = createListCommand.listId;

      beforeEach(async () => {
        await framework.commandHelpers.createList(createListCommand);
        await framework.commandHelpers.addArticleToList(arbitraryArticleId(), userListId);
      });

      describe('and is currently featured by this group', () => {
        it.todo('is not included');
      });

      describe('and is not currently featured by this group', () => {
        let availableListIds: ReadonlyArray<ListId>;

        beforeEach(() => {
          availableListIds = pipe(
            constructListsThatCanBeFeatured(framework.dependenciesForViews, group),
            RA.map((listThatCanBeFeatured) => listThatCanBeFeatured.listId),
          );
        });

        it.skip('is included', () => {
          expect(availableListIds).toContain(userListId);
        });
      });

      describe('and was featured by this group, but is not longer featured', () => {
        it.todo('is included');
      });

      describe('and is currently featured only by a different group', () => {
        it.todo('is included');
      });
    });

    describe('given a user list that is empty', () => {
      it.todo('is not included');
    });

    describe('given a list owned by the group', () => {
      it.todo('is not included');
    });

    describe('given a list owned by a different group', () => {
      it.todo('is not included');
    });
  });
});
