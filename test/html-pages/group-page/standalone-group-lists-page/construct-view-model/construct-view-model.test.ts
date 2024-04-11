import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
import * as RA from 'fp-ts/ReadonlyArray';
import { createTestFramework, TestFramework } from '../../../../framework';
import * as LOID from '../../../../../src/types/list-owner-id';
import { ViewModel } from '../../../../../src/html-pages/group-page/standalone-group-lists-page/view-model';
import { constructViewModel } from '../../../../../src/html-pages/group-page/standalone-group-lists-page/construct-view-model/construct-view-model';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { List } from '../../../../../src/read-models/lists';
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
    let listCardIds: ReadonlyArray<ViewModel['listCards'][number]['listId']>;

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      initialGroupList = framework.queries.selectAllListsOwnedBy(LOID.fromGroupId(addGroupCommand.groupId))[0];
      await framework.commandHelpers.createList(createMiddleList);
      await framework.commandHelpers.addArticleToList(arbitraryArticleId(), createMiddleList.listId);
      await framework.commandHelpers.createList(createMostRecentlyUpdatedList);
      await framework.commandHelpers.addArticleToList(arbitraryArticleId(), createMostRecentlyUpdatedList.listId);

      listCardIds = await pipe(
        {
          slug: addGroupCommand.slug,
          user: O.none,
        },
        constructViewModel(framework.queries),
        TE.getOrElse(shouldNotBeCalled),
        T.map((viewModel) => viewModel.listCards),
        T.map(RA.map((list) => list.listId)),
      )();
    });

    it('returns lists in descending order of updated date', () => {
      expect(listCardIds).toStrictEqual([
        createMostRecentlyUpdatedList.listId,
        createMiddleList.listId,
        initialGroupList.id,
      ]);
    });
  });
});
