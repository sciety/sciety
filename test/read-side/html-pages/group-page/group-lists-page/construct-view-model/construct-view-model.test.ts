import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { List } from '../../../../../../src/read-models/lists';
import { constructViewModel } from '../../../../../../src/read-side/html-pages/group-page/group-lists-page/construct-view-model/construct-view-model';
import { ViewModel } from '../../../../../../src/read-side/html-pages/group-page/group-lists-page/view-model';
import * as LOID from '../../../../../../src/types/list-owner-id';
import { createTestFramework, TestFramework } from '../../../../../framework';
import { shouldNotBeCalled } from '../../../../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../../../../types/expression-doi.helper';
import { arbitraryAddGroupCommand } from '../../../../../write-side/commands/add-group-command.helper';
import { arbitraryCreateListCommand } from '../../../../../write-side/commands/create-list-command.helper';

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
    const expectedNumberOfListsCreated = 3;
    let listCardIds: ReadonlyArray<ViewModel['listCards'][number]['listId']>;
    let listCount: number;

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      initialGroupList = framework.queries.selectAllListsOwnedBy(LOID.fromGroupId(addGroupCommand.groupId))[0];
      await framework.commandHelpers.createList(createMiddleList);
      await framework.commandHelpers.addArticleToList(
        { articleId: arbitraryExpressionDoi(), listId: createMiddleList.listId },
      );
      await framework.commandHelpers.createList(createMostRecentlyUpdatedList);
      await framework.commandHelpers.addArticleToList(
        { articleId: arbitraryExpressionDoi(), listId: createMostRecentlyUpdatedList.listId },
      );

      const viewModel = await pipe(
        {
          slug: addGroupCommand.slug,
          user: O.none,
        },
        constructViewModel(framework.queries),
        TE.getOrElse(shouldNotBeCalled),
      )();

      listCardIds = pipe(
        viewModel.listCards,
        RA.map((list) => list.listId),
      );

      listCount = viewModel.listCount;
    });

    it('returns lists in descending order of updated date', () => {
      expect(listCardIds).toStrictEqual([
        createMostRecentlyUpdatedList.listId,
        createMiddleList.listId,
        initialGroupList.id,
      ]);
    });

    it('returns the total list count for the group', () => {
      expect(listCount).toStrictEqual(expectedNumberOfListsCreated);
    });
  });
});
