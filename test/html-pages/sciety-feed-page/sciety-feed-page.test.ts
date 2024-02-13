import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { scietyFeedPage } from '../../../src/html-pages/sciety-feed-page/sciety-feed-page';
import { dummyLogger } from '../../dummy-logger';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';
import { TestFramework, createTestFramework } from '../../framework';
import { arbitraryCreateListCommand } from '../../write-side/commands/create-list-command.helper';
import { arbitraryAddGroupCommand } from '../../write-side/commands/add-group-command.helper';
import { constructViewModel } from '../../../src/html-pages/sciety-feed-page/construct-view-model';

describe('sciety-feed-page', () => {
  const addGroupCommand = arbitraryAddGroupCommand();
  let framework: TestFramework;

  const renderPage = async (pageSize: number) => {
    const dependencies = {
      ...framework.queries,
      logger: dummyLogger,
      getAllEvents: framework.getAllEvents,
    };
    return pipe(
      scietyFeedPage(dependencies)(pageSize)({ page: 1 }),
      T.map(E.getOrElseW(shouldNotBeCalled)),
      T.map((page) => page.content),
    )();
  };

  beforeEach(() => {
    framework = createTestFramework();
  });

  it('renders a single article added to a list as a card', async () => {
    const createListCommand = arbitraryCreateListCommand();
    await framework.commandHelpers.createList(createListCommand);
    await framework.commandHelpers.addArticleToList(arbitraryArticleId(), createListCommand.listId);
    const renderedPage = await renderPage(20);

    expect(renderedPage).toContain('added an article to a list');
  });

  it('renders a single user followed editorial community as a card', async () => {
    await framework.commandHelpers.addGroup(addGroupCommand);
    await framework.commandHelpers.followGroup(arbitraryUserId(), addGroupCommand.groupId);
    const renderedPage = await renderPage(20);

    expect(renderedPage).toContain('followed a group');
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
