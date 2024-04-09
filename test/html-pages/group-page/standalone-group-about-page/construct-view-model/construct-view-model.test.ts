import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { createTestFramework, TestFramework } from '../../../../framework';
import * as LOID from '../../../../../src/types/list-owner-id';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { List } from '../../../../../src/read-models/lists';
import { arbitraryArticleId } from '../../../../types/article-id.helper';
import { arbitraryCreateListCommand } from '../../../../write-side/commands/create-list-command.helper';
import { arbitraryAddGroupCommand } from '../../../../write-side/commands/add-group-command.helper';
import { ViewModel } from '../../../../../src/html-pages/group-page/standalone-group-about-page/view-model';
import { constructViewModel } from '../../../../../src/html-pages/group-page/standalone-group-about-page/construct-view-model';

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
    let ourListIds: ReadonlyArray<ViewModel['ourLists']['lists'][number]['listId']>;

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      initialGroupList = framework.queries.selectAllListsOwnedBy(LOID.fromGroupId(addGroupCommand.groupId))[0];
      await framework.commandHelpers.createList(createMiddleList);
      await framework.commandHelpers.addArticleToList(arbitraryArticleId(), createMiddleList.listId);
      await framework.commandHelpers.createList(createMostRecentlyUpdatedList);
      await framework.commandHelpers.addArticleToList(arbitraryArticleId(), createMostRecentlyUpdatedList.listId);

      ourListIds = await pipe(
        {
          slug: addGroupCommand.slug,
          user: O.none,
        },
        constructViewModel(framework.dependenciesForViews),
        TE.getOrElse(shouldNotBeCalled),
        T.map((viewModel) => viewModel.ourLists.lists),
        T.map(RA.map((list) => list.listId)),
      )();
    });

    it('returns lists in descending order of updated date', () => {
      expect(ourListIds).toStrictEqual([
        createMostRecentlyUpdatedList.listId,
        createMiddleList.listId,
        initialGroupList.id,
      ]);
    });
  });
});
