import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { createTestFramework, TestFramework } from '../../../../framework';
import * as LOID from '../../../../../src/types/list-owner-id';
import { ViewModel } from '../../../../../src/html-pages/group-page/group-about-page/view-model';
import { constructViewModel } from '../../../../../src/html-pages/group-page/group-about-page/construct-view-model/construct-view-model';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { List } from '../../../../../src/read-models/lists/list';
import { arbitraryArticleId } from '../../../../types/article-id.helper';
import { arbitraryCreateListCommand } from '../../../../write-side/commands/create-list-command.helper';
import { arbitraryAddGroupCommand } from '../../../../write-side/commands/add-group-command.helper';

describe('construct-view-model', () => {
  let framework: TestFramework;
  const addGroupCommand = arbitraryAddGroupCommand();

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the group has more than one list', () => {
    let initialGroupList: List;
    const createMiddleList = {
      ...arbitraryCreateListCommand(),
      ownerId: LOID.fromGroupId(addGroupCommand.groupId),
    };
    const createMostRecentlyUpdatedList = {
      ...arbitraryCreateListCommand(),
      ownerId: LOID.fromGroupId(addGroupCommand.groupId),
    };
    let viewmodel: ViewModel;

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      initialGroupList = framework.queries.selectAllListsOwnedBy(LOID.fromGroupId(addGroupCommand.groupId))[0];
      await framework.commandHelpers.createList(createMiddleList);
      await framework.commandHelpers.addArticleToList(arbitraryArticleId(), createMiddleList.listId);
      await framework.commandHelpers.createList(createMostRecentlyUpdatedList);
      await framework.commandHelpers.addArticleToList(arbitraryArticleId(), createMostRecentlyUpdatedList.listId);

      viewmodel = await pipe(
        {
          slug: addGroupCommand.slug,
          user: O.none,
        },
        constructViewModel(framework.dependenciesForViews),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns lists in descending order of updated date', () => {
      expect(viewmodel.ourLists.lists).toStrictEqual([
        expect.objectContaining({
          listId: createMostRecentlyUpdatedList.listId,
        }),
        expect.objectContaining({
          listId: createMiddleList.listId,
        }),
        expect.objectContaining({
          listId: initialGroupList.id,
        }),
      ]);
    });
  });
});
