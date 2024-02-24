import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { shouldNotBeCalled } from '../../should-not-be-called.js';
import { arbitraryArticleId } from '../../types/article-id.helper.js';
import { arbitraryUserId } from '../../types/user-id.helper.js';
import { TestFramework, createTestFramework } from '../../framework/index.js';
import { arbitraryCreateListCommand } from '../../write-side/commands/create-list-command.helper.js';
import { arbitraryAddGroupCommand } from '../../write-side/commands/add-group-command.helper.js';
import { constructViewModel } from '../../../src/html-pages/sciety-feed-page/construct-view-model/index.js';

describe('sciety-feed-page', () => {
  const addGroupCommand = arbitraryAddGroupCommand();
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  it('displays at most a page of cards at a time', async () => {
    await framework.commandHelpers.addGroup(addGroupCommand);
    await framework.commandHelpers.followGroup(arbitraryUserId(), addGroupCommand.groupId);
    await framework.commandHelpers.followGroup(arbitraryUserId(), addGroupCommand.groupId);
    await framework.commandHelpers.followGroup(arbitraryUserId(), addGroupCommand.groupId);
    const viewModel = await pipe(
      { page: 1 },
      constructViewModel({
        ...framework.dependenciesForViews,
        getAllEvents: framework.getAllEvents,
      }, 2),
      TE.getOrElse(shouldNotBeCalled),
    )();

    expect(viewModel.cards).toHaveLength(2);
  });

  it('does not display uninteresting events', async () => {
    const articleId = arbitraryArticleId();
    const createListCommand = arbitraryCreateListCommand();
    const userId = arbitraryUserId();
    await framework.commandHelpers.addGroup(addGroupCommand);
    await framework.commandHelpers.createList(createListCommand);
    await framework.commandHelpers.addArticleToList(articleId, createListCommand.listId);
    await framework.commandHelpers.removeArticleFromList(articleId, createListCommand.listId);
    await framework.commandHelpers.unfollowGroup(userId, addGroupCommand.groupId);
    const viewModel = await pipe(
      { page: 1 },
      constructViewModel({
        ...framework.dependenciesForViews,
        getAllEvents: framework.getAllEvents,
      }, 10),
      TE.getOrElse(shouldNotBeCalled),
    )();

    expect(viewModel.cards).toHaveLength(1);
  });
});
