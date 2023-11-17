import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { scietyFeedPage } from '../../../src/html-pages/sciety-feed-page/sciety-feed-page.js';
import { dummyLogger } from '../../dummy-logger.js';
import { shouldNotBeCalled } from '../../should-not-be-called.js';
import { arbitraryArticleId } from '../../types/article-id.helper.js';
import { arbitraryUserId } from '../../types/user-id.helper.js';
import { TestFramework, createTestFramework } from '../../framework/index.js';
import { arbitraryCreateListCommand } from '../../write-side/commands/create-list-command.helper.js';
import { arbitraryAddGroupCommand } from '../../write-side/commands/add-group-command.helper.js';

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

  it('renders at most a page of cards at a time', async () => {
    await framework.commandHelpers.addGroup(addGroupCommand);
    await framework.commandHelpers.followGroup(arbitraryUserId(), addGroupCommand.groupId);
    await framework.commandHelpers.followGroup(arbitraryUserId(), addGroupCommand.groupId);
    await framework.commandHelpers.followGroup(arbitraryUserId(), addGroupCommand.groupId);
    const renderedPage = await renderPage(3);
    const html = JSDOM.fragment(renderedPage);
    const itemCount = Array.from(html.querySelectorAll('.sciety-feed-card')).length;

    expect(itemCount).toBe(3);
  });

  it('does not render uninteresting events', async () => {
    const articleId = arbitraryArticleId();
    const createListCommand = arbitraryCreateListCommand();
    const userId = arbitraryUserId();
    await framework.commandHelpers.addGroup(addGroupCommand);
    await framework.commandHelpers.createList(createListCommand);
    await framework.commandHelpers.addArticleToList(articleId, createListCommand.listId);
    await framework.commandHelpers.removeArticleFromList(articleId, createListCommand.listId);
    await framework.commandHelpers.unfollowGroup(userId, addGroupCommand.groupId);
    const renderedPage = await renderPage(10);
    const html = JSDOM.fragment(renderedPage);
    const itemCount = Array.from(html.querySelectorAll('.sciety-feed-card')).length;

    expect(itemCount).toBe(1);
  });
});
